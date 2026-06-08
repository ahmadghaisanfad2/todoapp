import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { HafalanLog } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[hafalanLogStore] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[hafalanLogStore] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[hafalanLogStore] Failed to remove from localStorage: ${name}`)
    }
  },
}

interface HafalanLogStore {
  logs: HafalanLog[]
  addLog: (log: Omit<HafalanLog, 'id'>) => void
  deleteLog: (id: string) => void
  getLogsBySantriAndTask: (santriId: string, taskId: string) => HafalanLog[]
  getLatestLog: (santriId: string, taskId: string) => HafalanLog | null
  hasCompleted: (santriId: string, taskId: string) => boolean
}

export const useHafalanLogStore = create<HafalanLogStore>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (log) =>
        set((state) => ({
          logs: [
            ...state.logs,
            {
              ...log,
              id: generateId(),
            },
          ],
        })),
      deleteLog: (id) =>
        set((state) => ({
          logs: state.logs.filter((l) => l.id !== id),
        })),
      getLogsBySantriAndTask: (santriId, taskId) => {
        const { logs } = get()
        return logs
          .filter((l) => l.santriId === santriId && l.taskId === taskId)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      },
      getLatestLog: (santriId, taskId) => {
        const { logs } = get()
        return (
          logs
            .filter((l) => l.santriId === santriId && l.taskId === taskId)
            .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0] ?? null
        )
      },
      hasCompleted: (santriId, taskId) => {
        const { logs } = get()
        return logs.some(
          (l) => l.santriId === santriId && l.taskId === taskId && l.type === 'setor'
        )
      },
    }),
    { name: STORAGE_KEYS.HAFALAN_LOGS, storage: createJSONStorage(() => safeStorage) }
  )
)
