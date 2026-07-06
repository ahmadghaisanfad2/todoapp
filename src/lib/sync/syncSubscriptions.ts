import { apiFetch } from '@/lib/api'
import { useCategoryStore } from '@/store/categoryStore'
import { useKanbanStore } from '@/store/kanbanStore'
import { useMusicStore } from '@/store/musicStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useSyncStatusStore } from '@/store/syncStatusStore'
import { useTaskStore } from '@/store/taskStore'
import { useWorkspaceStore } from '@/store/workspaceStore'

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

let pushEnabled = false
let bootstrapped = false

export function setSyncPushEnabled(enabled: boolean) {
  pushEnabled = enabled
}

export function setSyncBootstrapped(value: boolean) {
  bootstrapped = value
}

async function pushWithStatus(fn: () => Promise<Response>) {
  if (!pushEnabled || !bootstrapped) return
  const { setStatus, setError } = useSyncStatusStore.getState()
  setStatus('syncing')
  try {
    const res = await fn()
    if (!res.ok) throw new Error(`Sync push failed: ${res.status}`)
    setStatus('synced')
    setError(null)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Sync failed'
    setError(message)
    setStatus(navigator.onLine ? 'error' : 'offline')
  }
}

const pushWorkspaces = debounce(() => {
  const state = useWorkspaceStore.getState()
  void pushWithStatus(() =>
    apiFetch('/api/sync/workspaces', {
      method: 'PUT',
      body: JSON.stringify({
        workspaces: state.workspaces.map((w) => ({
          ...w,
          updatedAt: new Date().toISOString(),
        })),
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    })
  )
}, 400)

const pushTasks = debounce(() => {
  const tasks = useTaskStore.getState().tasks
  void pushWithStatus(() =>
    apiFetch('/api/sync/tasks', {
      method: 'PUT',
      body: JSON.stringify({ tasks }),
    })
  )
}, 400)

const pushCategories = debounce(() => {
  const categories = useCategoryStore.getState().categories
  void pushWithStatus(() =>
    apiFetch('/api/sync/categories', {
      method: 'PUT',
      body: JSON.stringify({
        categories: categories.map((c) => ({
          ...c,
          updatedAt: new Date().toISOString(),
        })),
      }),
    })
  )
}, 400)

const pushKanban = debounce(() => {
  const columns = useKanbanStore.getState().columns
  void pushWithStatus(() =>
    apiFetch('/api/sync/kanban', {
      method: 'PUT',
      body: JSON.stringify({
        columns: columns.map((c) => ({
          ...c,
          updatedAt: new Date().toISOString(),
        })),
      }),
    })
  )
}, 400)

const pushSettings = debounce(() => {
  const settings = useSettingsStore.getState()
  const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId
  void pushWithStatus(() =>
    apiFetch('/api/sync/settings', {
      method: 'PUT',
      body: JSON.stringify({
        theme: settings.theme,
        sortBy: settings.sortBy,
        activeWorkspaceId,
      }),
    })
  )
}, 400)

const pushMusic = debounce(() => {
  const music = useMusicStore.getState()
  void pushWithStatus(() =>
    apiFetch('/api/sync/music', {
      method: 'PUT',
      body: JSON.stringify({
        volume: music.volume,
        isShuffle: music.isShuffle,
        repeatMode: music.repeatMode,
        playlists: music.playlists,
        history: music.history,
      }),
    })
  )
}, 400)

export function subscribeSyncPush() {
  const unsubs = [
    useWorkspaceStore.subscribe(pushWorkspaces),
    useTaskStore.subscribe(pushTasks),
    useCategoryStore.subscribe(pushCategories),
    useKanbanStore.subscribe(pushKanban),
    useSettingsStore.subscribe(pushSettings),
    useMusicStore.subscribe(pushMusic),
  ]

  return () => {
    unsubs.forEach((unsub) => unsub())
  }
}
