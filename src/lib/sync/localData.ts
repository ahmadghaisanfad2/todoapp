import { STORAGE_KEYS } from '@/lib/constants'
import type { LocalDataSummary } from '@/lib/sync/types'

interface PersistEnvelope<T> {
  state: T
  version: number
}

function readPersistState<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistEnvelope<T>
    return parsed.state ?? null
  } catch {
    return null
  }
}

export function getLocalDataSummary(): LocalDataSummary {
  const workspaces = readPersistState<{ workspaces: unknown[] }>(STORAGE_KEYS.WORKSPACES)
  const tasks = readPersistState<{ tasks: unknown[] }>(STORAGE_KEYS.TASKS)
  const categories = readPersistState<{ categories: unknown[] }>(STORAGE_KEYS.CATEGORIES)
  const kanban = readPersistState<{ columns: unknown[] }>(STORAGE_KEYS.KANBAN)
  const settings = readPersistState<Record<string, unknown>>(STORAGE_KEYS.SETTINGS)
  const music = readPersistState<{ playlists: unknown[]; history: unknown[] }>(STORAGE_KEYS.MUSIC)

  const hasWorkspaces = (workspaces?.workspaces?.length ?? 0) > 0
  const hasTasks = (tasks?.tasks?.length ?? 0) > 0
  const hasCategories = (categories?.categories?.length ?? 0) > 0
  const hasKanban = (kanban?.columns?.length ?? 0) > 0
  const hasSettings = settings !== null
  const hasMusic =
    (music?.playlists?.length ?? 0) > 0 || (music?.history?.length ?? 0) > 0

  return {
    hasWorkspaces,
    hasTasks,
    hasCategories,
    hasKanban,
    hasSettings,
    hasMusic,
    isEmpty: !hasWorkspaces && !hasTasks && !hasCategories && !hasKanban && !hasSettings && !hasMusic,
  }
}

export function readLocalWorkspaceState() {
  return readPersistState<{
    workspaces: Array<{
      id: string
      name: string
      color: string
      createdAt: string
    }>
    activeWorkspaceId: string
  }>(STORAGE_KEYS.WORKSPACES)
}

export function readLocalTasks() {
  return readPersistState<{ tasks: Array<Record<string, unknown>> }>(STORAGE_KEYS.TASKS)?.tasks ?? []
}

export function readLocalCategories() {
  return readPersistState<{ categories: Array<Record<string, unknown>> }>(STORAGE_KEYS.CATEGORIES)?.categories ?? []
}

export function readLocalKanban() {
  return readPersistState<{ columns: Array<Record<string, unknown>> }>(STORAGE_KEYS.KANBAN)?.columns ?? []
}

export function readLocalSettings() {
  return readPersistState<{ theme: string; sortBy: string }>(STORAGE_KEYS.SETTINGS)
}

export function readLocalMusic() {
  return readPersistState<{
    volume: number
    isShuffle: boolean
    repeatMode: string
    playlists: unknown[]
    history: unknown[]
  }>(STORAGE_KEYS.MUSIC)
}
