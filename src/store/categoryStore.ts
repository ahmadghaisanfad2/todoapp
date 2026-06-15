import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Category } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'
import { useUndoStore } from '@/store/undoStore'

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
  deleteCategoriesByWorkspace: (workspaceId: string) => void
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
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
      deleteCategory: (id) => {
        const category = get().categories.find((c) => c.id === id)
        if (category) {
          useUndoStore.getState().pushUndo('Category deleted', () => {
            useCategoryStore.setState((s) => ({
              categories: [...s.categories, category],
            }))
          })
        }
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },
      deleteCategoriesByWorkspace: (workspaceId) => {
        const deleted = get().categories.filter((c) => c.workspaceId === workspaceId)
        if (deleted.length > 0) {
          useUndoStore.getState().pushUndo(
            `${deleted.length} categor${deleted.length > 1 ? 'ies' : 'y'} deleted`,
            () => {
              useCategoryStore.setState((s) => ({
                categories: [...s.categories, ...deleted],
              }))
            }
          )
        }
        set((state) => ({
          categories: state.categories.filter((c) => c.workspaceId !== workspaceId),
        }))
      },
    }),
    { name: STORAGE_KEYS.CATEGORIES, storage: createJSONStorage(() => safeStorage) }
  )
)
