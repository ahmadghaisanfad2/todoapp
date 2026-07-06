import { apiFetch } from '@/lib/api'
import { useCategoryStore } from '@/store/categoryStore'
import { useKanbanStore } from '@/store/kanbanStore'
import { useMusicStore } from '@/store/musicStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useTaskStore } from '@/store/taskStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import type { SyncSnapshot } from '@/lib/sync/types'
import type { Category, KanbanColumn, Task, Workspace } from '@/types'

export function hydrateStoresFromSnapshot(snapshot: SyncSnapshot) {
  if (snapshot.workspaces.length > 0) {
    useWorkspaceStore.setState({
      workspaces: snapshot.workspaces as Workspace[],
      activeWorkspaceId: snapshot.activeWorkspaceId || snapshot.workspaces[0]?.id || '',
    })
  }

  useTaskStore.setState({ tasks: snapshot.tasks as Task[] })
  useCategoryStore.setState({ categories: snapshot.categories as Category[] })

  if (snapshot.columns.length > 0) {
    useKanbanStore.setState({ columns: snapshot.columns as KanbanColumn[] })
  }

  if (snapshot.settings) {
    useSettingsStore.setState({
      theme: snapshot.settings.theme,
      sortBy: snapshot.settings.sortBy,
    })
  }

  if (snapshot.music) {
    useMusicStore.setState({
      volume: snapshot.music.volume,
      isShuffle: snapshot.music.isShuffle,
      repeatMode: snapshot.music.repeatMode,
    })
    if (snapshot.music.playlists.length > 0) {
      useMusicStore.setState({ playlists: snapshot.music.playlists })
    }
    if (snapshot.music.history.length > 0) {
      useMusicStore.setState({ history: snapshot.music.history })
    }
  }
}

export async function pushAllLocalToCloud() {
  const workspaceState = useWorkspaceStore.getState()
  const tasks = useTaskStore.getState().tasks
  const categories = useCategoryStore.getState().categories
  const columns = useKanbanStore.getState().columns
  const settings = useSettingsStore.getState()
  const music = useMusicStore.getState()

  await apiFetch('/api/sync/workspaces', {
    method: 'PUT',
    body: JSON.stringify({
      workspaces: workspaceState.workspaces.map((w) => ({
        ...w,
        updatedAt: new Date().toISOString(),
      })),
      activeWorkspaceId: workspaceState.activeWorkspaceId,
    }),
  })

  if (tasks.length > 0) {
    await apiFetch('/api/sync/tasks', {
      method: 'PUT',
      body: JSON.stringify({ tasks }),
    })
  }

  if (categories.length > 0) {
    await apiFetch('/api/sync/categories', {
      method: 'PUT',
      body: JSON.stringify({
        categories: categories.map((c) => ({
          ...c,
          updatedAt: new Date().toISOString(),
        })),
      }),
    })
  }

  if (columns.length > 0) {
    await apiFetch('/api/sync/kanban', {
      method: 'PUT',
      body: JSON.stringify({
        columns: columns.map((c) => ({
          ...c,
          updatedAt: new Date().toISOString(),
        })),
      }),
    })
  }

  await apiFetch('/api/sync/settings', {
    method: 'PUT',
    body: JSON.stringify({
      theme: settings.theme,
      sortBy: settings.sortBy,
      activeWorkspaceId: workspaceState.activeWorkspaceId,
    }),
  })

  await apiFetch('/api/sync/music', {
    method: 'PUT',
    body: JSON.stringify({
      volume: music.volume,
      isShuffle: music.isShuffle,
      repeatMode: music.repeatMode,
      playlists: music.playlists,
      history: music.history,
    }),
  })
}
