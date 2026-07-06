import { and, eq, isNull } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/index.js'
import {
  categories,
  kanbanColumns,
  tasks,
  userSettings,
  workspaces,
} from '../db/schema.js'
import type { AuthVariables } from '../middleware/session.js'
import { requireSession } from '../middleware/session.js'

type SyncEnv = { Variables: AuthVariables }

const sync = new Hono<SyncEnv>()

sync.use('*', requireSession)

sync.get('/snapshot', async (c) => {
  const userId = c.get('userId')

  const [workspaceRows, taskRows, categoryRows, columnRows, settingsRow] = await Promise.all([
    db.select().from(workspaces).where(eq(workspaces.userId, userId)),
    db.select().from(tasks).where(and(eq(tasks.userId, userId), isNull(tasks.deletedAt))),
    db.select().from(categories).where(eq(categories.userId, userId)),
    db.select().from(kanbanColumns).where(eq(kanbanColumns.userId, userId)),
    db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1),
  ])

  return c.json({
    workspaces: workspaceRows.map(toWorkspaceDto),
    activeWorkspaceId: settingsRow[0]?.activeWorkspaceId ?? '',
    tasks: taskRows.map(toTaskDto),
    categories: categoryRows.map(toCategoryDto),
    columns: columnRows.map(toColumnDto),
    settings: settingsRow[0] ? toSettingsDto(settingsRow[0]) : null,
    music: settingsRow[0] ? toMusicDto(settingsRow[0]) : null,
    isEmpty:
      workspaceRows.length === 0 &&
      taskRows.length === 0 &&
      categoryRows.length === 0 &&
      columnRows.length === 0 &&
      !settingsRow[0],
  })
})

sync.put('/workspaces', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<{ workspaces: WorkspaceInput[]; activeWorkspaceId?: string }>()
  const now = new Date().toISOString()

  for (const row of body.workspaces) {
    await db
      .insert(workspaces)
      .values({
        id: row.id,
        userId,
        name: row.name,
        color: row.color,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt ?? now,
      })
      .onConflictDoUpdate({
        target: workspaces.id,
        set: {
          name: row.name,
          color: row.color,
          updatedAt: row.updatedAt ?? now,
        },
      })
  }

  if (body.activeWorkspaceId !== undefined) {
    await upsertSettingsPartial(userId, { activeWorkspaceId: body.activeWorkspaceId })
  }

  return c.json({ ok: true })
})

sync.put('/tasks', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<{ tasks: TaskInput[] }>()
  const now = new Date().toISOString()

  for (const row of body.tasks) {
    await db
      .insert(tasks)
      .values({
        id: row.id,
        userId,
        workspaceId: row.workspaceId,
        title: row.title,
        notes: row.notes,
        completed: row.completed,
        priority: row.priority,
        categoryId: row.categoryId,
        dueDate: row.dueDate,
        status: row.status,
        order: row.order,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt ?? now,
        deletedAt: row.deletedAt ?? null,
      })
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          workspaceId: row.workspaceId,
          title: row.title,
          notes: row.notes,
          completed: row.completed,
          priority: row.priority,
          categoryId: row.categoryId,
          dueDate: row.dueDate,
          status: row.status,
          order: row.order,
          updatedAt: row.updatedAt ?? now,
          deletedAt: row.deletedAt ?? null,
        },
      })
  }

  return c.json({ ok: true })
})

sync.put('/categories', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<{ categories: CategoryInput[] }>()
  const now = new Date().toISOString()

  for (const row of body.categories) {
    await db
      .insert(categories)
      .values({
        id: row.id,
        userId,
        workspaceId: row.workspaceId,
        name: row.name,
        color: row.color,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt ?? now,
      })
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          workspaceId: row.workspaceId,
          name: row.name,
          color: row.color,
          updatedAt: row.updatedAt ?? now,
        },
      })
  }

  return c.json({ ok: true })
})

sync.put('/kanban', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<{ columns: ColumnInput[] }>()
  const now = new Date().toISOString()

  for (const row of body.columns) {
    await db
      .insert(kanbanColumns)
      .values({
        id: row.id,
        userId,
        name: row.name,
        order: row.order,
        crossTasks: row.crossTasks ?? null,
        updatedAt: row.updatedAt ?? now,
      })
      .onConflictDoUpdate({
        target: kanbanColumns.id,
        set: {
          name: row.name,
          order: row.order,
          crossTasks: row.crossTasks ?? null,
          updatedAt: row.updatedAt ?? now,
        },
      })
  }

  return c.json({ ok: true })
})

sync.put('/settings', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<SettingsInput>()
  await upsertSettingsPartial(userId, body)
  return c.json({ ok: true })
})

sync.put('/music', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<MusicInput>()
  await upsertSettingsPartial(userId, {
    volume: body.volume,
    isShuffle: body.isShuffle,
    repeatMode: body.repeatMode,
    playlists: body.playlists,
    history: body.history,
  })
  return c.json({ ok: true })
})

export { sync }

interface WorkspaceInput {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt?: string
}

interface TaskInput {
  id: string
  workspaceId: string
  title: string
  notes: string | null
  completed: boolean
  priority: string
  categoryId: string | null
  dueDate: string | null
  status: string
  order: number
  createdAt: string
  updatedAt?: string
  deletedAt?: string | null
}

interface CategoryInput {
  id: string
  workspaceId: string
  name: string
  color: string
  createdAt: string
  updatedAt?: string
}

interface ColumnInput {
  id: string
  name: string
  order: number
  crossTasks?: boolean
  updatedAt?: string
}

interface SettingsInput {
  theme?: string
  sortBy?: string
  activeWorkspaceId?: string
}

interface MusicInput {
  volume: number
  isShuffle: boolean
  repeatMode: string
  playlists: unknown[]
  history: unknown[]
}

async function upsertSettingsPartial(
  userId: string,
  partial: Partial<{
    theme: string
    sortBy: string
    activeWorkspaceId: string
    volume: number
    isShuffle: boolean
    repeatMode: string
    playlists: unknown[]
    history: unknown[]
  }>
) {
  const now = new Date().toISOString()
  const existing = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)

  if (existing.length === 0) {
    await db.insert(userSettings).values({
      userId,
      theme: partial.theme ?? 'system',
      sortBy: partial.sortBy ?? 'createdAt',
      activeWorkspaceId: partial.activeWorkspaceId ?? '',
      volume: partial.volume ?? 50,
      isShuffle: partial.isShuffle ?? false,
      repeatMode: partial.repeatMode ?? 'off',
      playlists: partial.playlists ?? [],
      history: partial.history ?? [],
      updatedAt: now,
    })
    return
  }

  const current = existing[0]
  await db
    .update(userSettings)
    .set({
      theme: partial.theme ?? current.theme,
      sortBy: partial.sortBy ?? current.sortBy,
      activeWorkspaceId: partial.activeWorkspaceId ?? current.activeWorkspaceId,
      volume: partial.volume ?? current.volume,
      isShuffle: partial.isShuffle ?? current.isShuffle,
      repeatMode: partial.repeatMode ?? current.repeatMode,
      playlists: partial.playlists ?? current.playlists,
      history: partial.history ?? current.history,
      updatedAt: now,
    })
    .where(eq(userSettings.userId, userId))
}

function toWorkspaceDto(row: typeof workspaces.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function toTaskDto(row: typeof tasks.$inferSelect) {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    title: row.title,
    notes: row.notes,
    completed: row.completed,
    priority: row.priority,
    categoryId: row.categoryId,
    dueDate: row.dueDate,
    status: row.status,
    order: row.order,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function toCategoryDto(row: typeof categories.$inferSelect) {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    color: row.color,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function toColumnDto(row: typeof kanbanColumns.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    order: row.order,
    crossTasks: row.crossTasks ?? undefined,
    updatedAt: row.updatedAt,
  }
}

function toSettingsDto(row: typeof userSettings.$inferSelect) {
  return {
    theme: row.theme,
    sortBy: row.sortBy,
  }
}

function toMusicDto(row: typeof userSettings.$inferSelect) {
  return {
    volume: row.volume,
    isShuffle: row.isShuffle,
    repeatMode: row.repeatMode,
    playlists: row.playlists,
    history: row.history,
  }
}
