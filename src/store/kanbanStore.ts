import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { KanbanColumn } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS, DEFAULT_COLUMNS } from '@/lib/constants'
import { safeStorage } from '@/lib/safeStorage'
import { useUndoStore } from '@/store/undoStore'

interface KanbanStore {
  columns: KanbanColumn[]
  addColumn: (name: string) => void
  updateColumn: (id: string, updates: Partial<Pick<KanbanColumn, 'name'>>) => void
  deleteColumn: (id: string) => void
  reorderColumns: (columns: KanbanColumn[]) => void
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
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
      deleteColumn: (id) => {
        const column = get().columns.find((col) => col.id === id)
        if (column) {
          useUndoStore.getState().pushUndo('Column deleted', () => {
            useKanbanStore.setState((s) => ({
              columns: [...s.columns, column],
            }))
          })
        }
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        }))
      },
      reorderColumns: (columns) => {
        const prevColumns = get().columns
        useUndoStore.getState().pushUndo('Columns reordered', () => {
          useKanbanStore.setState({ columns: prevColumns })
        })
        set({ columns })
      },
    }),
    { name: STORAGE_KEYS.KANBAN, storage: createJSONStorage(() => safeStorage) }
  )
)
