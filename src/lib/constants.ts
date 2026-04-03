export const STORAGE_KEYS = {
  TASKS: 'wazheefa-tasks',
  CATEGORIES: 'wazheefa-categories',
  SETTINGS: 'wazheefa-settings',
} as const

const OLD_STORAGE_KEYS = {
  TASKS: 'todoflow-tasks',
  CATEGORIES: 'todoflow-categories',
  SETTINGS: 'todoflow-settings',
} as const

export { OLD_STORAGE_KEYS }

export const APP_COLORS = {
  THEME: '#2563EB',
} as const
