export interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  categoryId: string | null
  dueDate: string | null // ISO datetime string (e.g., "2026-03-30T14:30:00")
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
  order: number
}

export interface Category {
  id: string
  name: string
  color: string // hex e.g. "#3B82F6"
  createdAt: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  sortBy: 'dueDate' | 'priority' | 'createdAt'
  filterStatus: 'all' | 'active' | 'completed'
  filterCategoryId: string | null
  filterPriority: 'all' | 'high' | 'medium' | 'low'
}

export type Priority = Task['priority']
export type Theme = AppSettings['theme']
export type SortBy = AppSettings['sortBy']
export type FilterStatus = AppSettings['filterStatus']
