import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Category } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[categoryStore] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[categoryStore] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[categoryStore] Failed to remove from localStorage: ${name}`)
    }
  },
}

interface CategoryStore {
  categories: Category[]
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => void
  deleteCategory: (id: string) => void
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: [],
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              ...category,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    { name: STORAGE_KEYS.CATEGORIES, storage: createJSONStorage(() => safeStorage) }
  )
)
