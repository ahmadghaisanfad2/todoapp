import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { HafalanTask } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[hafalanTaskStore] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[hafalanTaskStore] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[hafalanTaskStore] Failed to remove from localStorage: ${name}`)
    }
  },
}

interface HafalanTaskStore {
  tasks: HafalanTask[]
  addTask: (task: Omit<HafalanTask, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Omit<HafalanTask, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
}

export const useHafalanTaskStore = create<HafalanTaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    { name: STORAGE_KEYS.HAFALAN_TASKS, storage: createJSONStorage(() => safeStorage) }
  )
)
