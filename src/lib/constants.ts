export const STORAGE_KEYS = {
  TASKS: 'wazheefa-tasks',
  CATEGORIES: 'wazheefa-categories',
  SETTINGS: 'wazheefa-settings',
  KANBAN: 'wazheefa-kanban',
} as const

export const DEFAULT_COLUMNS = [
  { id: 'backlog', name: 'Backlog', order: 0 },
  { id: 'todo', name: 'To Do', order: 1 },
  { id: 'inprogress', name: 'In Progress', order: 2 },
  { id: 'done', name: 'Done', order: 3 },
] as const

const OLD_STORAGE_KEYS = {
  TASKS: 'todoflow-tasks',
  CATEGORIES: 'todoflow-categories',
  SETTINGS: 'todoflow-settings',
} as const

export { OLD_STORAGE_KEYS }

export const APP_COLORS = {
  THEME: '#2563EB',
} as const
