import { STORAGE_KEYS, OLD_STORAGE_KEYS } from './constants'

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
