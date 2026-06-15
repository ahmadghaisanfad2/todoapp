import { STORAGE_KEYS, OLD_STORAGE_KEYS, DEFAULT_WORKSPACE_NAME, DEFAULT_WORKSPACE_COLOR } from './constants'

export function runMigration() {
  try {
    const migrated = localStorage.getItem(STORAGE_KEYS.TASKS)
    if (migrated) return

    const tasks = localStorage.getItem(OLD_STORAGE_KEYS.TASKS)
    const categories = localStorage.getItem(OLD_STORAGE_KEYS.CATEGORIES)
    const settings = localStorage.getItem(OLD_STORAGE_KEYS.SETTINGS)

    if (tasks) localStorage.setItem(STORAGE_KEYS.TASKS, tasks)
    if (categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, categories)
    if (settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, settings)
  } catch {
    // Ignore migration errors — non-fatal
  }
}

export function migrateTaskStatus() {
  try {
    const stored = localStorage.getItem('wazheefa-tasks')
    if (!stored) return

    const data = JSON.parse(stored)
    if (!data.state?.tasks) return

    let needsUpdate = false
    const migrated = data.state.tasks.map((task: Record<string, unknown>) => {
      if (!task.status) {
        needsUpdate = true
        return { ...task, status: task.completed ? 'done' : 'todo' }
      }
      return task
    })

    if (needsUpdate) {
      data.state.tasks = migrated
      localStorage.setItem('wazheefa-tasks', JSON.stringify(data))
    }
  } catch {
    console.warn('[migrate] Failed to migrate task status')
  }
}

/**
 * Migrates existing tasks and categories to have a workspaceId.
 * Creates a default "Personal" workspace if none exists, then backfills
 * all tasks and categories that lack a workspaceId.
 */
export function migrateWorkspaceIds() {
  try {
    // 1. Ensure a default workspace exists
    const wsRaw = localStorage.getItem(STORAGE_KEYS.WORKSPACES)
    let workspaceId: string

    if (!wsRaw) {
      // No workspaces yet — create the store state with a default workspace
      const defaultWs = {
        id: crypto.randomUUID(),
        name: DEFAULT_WORKSPACE_NAME,
        color: DEFAULT_WORKSPACE_COLOR,
        createdAt: new Date().toISOString(),
      }
      const wsState = {
        state: {
          workspaces: [defaultWs],
          activeWorkspaceId: defaultWs.id,
        },
        version: 0,
      }
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(wsState))
      workspaceId = defaultWs.id
    } else {
      const parsed = JSON.parse(wsRaw)
      workspaceId = parsed.state?.activeWorkspaceId || parsed.state?.workspaces?.[0]?.id
      if (!workspaceId) return // shouldn't happen, but bail gracefully
    }

    // 2. Backfill tasks
    const tasksRaw = localStorage.getItem(STORAGE_KEYS.TASKS)
    if (tasksRaw) {
      const tasksData = JSON.parse(tasksRaw)
      if (tasksData.state?.tasks) {
        let tasksUpdated = false
        tasksData.state.tasks = tasksData.state.tasks.map((task: Record<string, unknown>) => {
          if (!task.workspaceId) {
            tasksUpdated = true
            return { ...task, workspaceId }
          }
          return task
        })
        if (tasksUpdated) {
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksData))
        }
      }
    }

    // 3. Backfill categories
    const catsRaw = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    if (catsRaw) {
      const catsData = JSON.parse(catsRaw)
      if (catsData.state?.categories) {
        let catsUpdated = false
        catsData.state.categories = catsData.state.categories.map((cat: Record<string, unknown>) => {
          if (!cat.workspaceId) {
            catsUpdated = true
            return { ...cat, workspaceId }
          }
          return cat
        })
        if (catsUpdated) {
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(catsData))
        }
      }
    }
  } catch {
    console.warn('[migrate] Failed to migrate workspace ids')
  }
}
