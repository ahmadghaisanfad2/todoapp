import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { KanbanColumn } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS, DEFAULT_COLUMNS } from '@/lib/constants'
import { safeStorage } from '@/lib/safeStorage'

interface KanbanStore {
  columns: KanbanColumn[]
  addColumn: (name: string) => void
  updateColumn: (id: string, updates: Partial<Pick<KanbanColumn, 'name'>>) => void
  deleteColumn: (id: string) => void
  reorderColumns: (columns: KanbanColumn[]) => void
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set) => ({
      columns: [...DEFAULT_COLUMNS],
      addColumn: (name) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: generateId(),
              name,
              order: state.columns.length,
            },
          ],
        })),
      updateColumn: (id, updates) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, ...updates } : col
          ),
        })),
      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        })),
      reorderColumns: (columns) => set({ columns }),
    }),
    { name: STORAGE_KEYS.KANBAN, storage: createJSONStorage(() => safeStorage) }
  )
)
