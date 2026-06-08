import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Santri } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[santriStore] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[santriStore] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[santriStore] Failed to remove from localStorage: ${name}`)
    }
  },
}

interface SantriStore {
  santri: Santri[]
  addSantri: (santri: Omit<Santri, 'id' | 'createdAt'>) => void
  updateSantri: (id: string, updates: Partial<Omit<Santri, 'id' | 'createdAt'>>) => void
  deleteSantri: (id: string) => void
}

export const useSantriStore = create<SantriStore>()(
  persist(
    (set) => ({
      santri: [],
      addSantri: (santri) =>
        set((state) => ({
          santri: [
            ...state.santri,
            {
              ...santri,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateSantri: (id, updates) =>
        set((state) => ({
          santri: state.santri.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      deleteSantri: (id) =>
        set((state) => ({
          santri: state.santri.filter((s) => s.id !== id),
        })),
    }),
    { name: STORAGE_KEYS.SANTRI, storage: createJSONStorage(() => safeStorage) }
  )
)
