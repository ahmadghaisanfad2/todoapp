export interface Workspace {
  id: string
  name: string
  color: string // hex e.g. "#3B82F6"
  createdAt: string
}

export interface Task {
  id: string
  title: string
  notes: string | null
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  categoryId: string | null
  workspaceId: string
  dueDate: string | null // ISO datetime string (e.g., "2026-03-30T14:30:00")
  status: string // column ID (default: 'todo')
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
  order: number
}

export interface Category {
  id: string
  name: string
  color: string // hex e.g. "#3B82F6"
  workspaceId: string
  createdAt: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  sortBy: 'dueDate' | 'priority' | 'createdAt'
  filterStatus: 'all' | 'active' | 'completed'
  filterCategoryId: string | null
  filterPriority: 'all' | 'high' | 'medium' | 'low'
}

export interface KanbanColumn {
  id: string
  name: string
  order: number
}

export type Priority = Task['priority']
export type Theme = AppSettings['theme']
export type SortBy = AppSettings['sortBy']
export type FilterStatus = AppSettings['filterStatus']
export type WorkspaceColor = Workspace['color']
