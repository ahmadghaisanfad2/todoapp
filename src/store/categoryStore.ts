import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '@/types'
import { generateId } from '@/lib/uuid'

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
    { name: 'todoflow-categories' }
  )
)
