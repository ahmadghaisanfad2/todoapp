import type { AppSettings, Category, KanbanColumn, Task, Workspace } from '@/types'

export interface MusicTrackDto {
  videoId: string
  title: string
  channel: string
}

export interface PlaylistDto {
  id: string
  name: string
  tracks: MusicTrackDto[]
}

export interface SyncSnapshot {
  workspaces: Workspace[]
  activeWorkspaceId: string
  tasks: Task[]
  categories: Category[]
  columns: KanbanColumn[]
  settings: Pick<AppSettings, 'theme' | 'sortBy'> | null
  music: {
    volume: number
    isShuffle: boolean
    repeatMode: 'off' | 'one' | 'all'
    playlists: PlaylistDto[]
    history: MusicTrackDto[]
  } | null
  isEmpty: boolean
}

export interface LocalDataSummary {
  hasWorkspaces: boolean
  hasTasks: boolean
  hasCategories: boolean
  hasKanban: boolean
  hasSettings: boolean
  hasMusic: boolean
  isEmpty: boolean
}
