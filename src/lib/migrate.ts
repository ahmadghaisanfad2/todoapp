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
