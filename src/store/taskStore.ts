import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'
import { safeStorage } from '@/lib/safeStorage'
import {
  reorderWithinColumn,
  moveBetweenColumns,
  moveTasksToColumn as applyMoveTasksToColumn,
} from '@/lib/taskOrdering'
import { useUndoStore } from '@/store/undoStore'
import type { Task } from '@/types'

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'> & { status?: string }) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  moveTask: (id: string, status: string, order: number) => void
  /** Batch-moves tasks into a column as ONE atomic state change + ONE undo entry. */
  moveTasksToColumn: (taskIds: string[], status: string) => void
  deleteTasksByWorkspace: (workspaceId: string) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              notes: task.notes ?? null,
              id: generateId(),
              status: task.status || 'todo',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              order: state.tasks.filter((t) => t.status === (task.status || 'todo')).length,
            },
          ],
        })),
      updateTask: (id, updates) => {
        const task = get().tasks.find((t) => t.id === id)
        if (task) {
          useUndoStore.getState().pushUndo('Task updated', () => {
            useTaskStore.setState((s) => ({
              tasks: s.tasks.map((t) => (t.id === id ? task : t)),
            }))
          })
        }
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }))
      },
      deleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (task) {
          useUndoStore.getState().pushUndo('Task deleted', () => {
            useTaskStore.setState((s) => ({ tasks: [...s.tasks, task] }))
          })
        }
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },
      toggleTask: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (task) {
          useUndoStore.getState().pushUndo('Task toggled', () => {
            useTaskStore.setState((s) => ({
              tasks: s.tasks.map((t) => (t.id === id ? task : t)),
            }))
          })
        }
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
              : t
          ),
        }))
      },
      moveTask: (id, status, order) => {
        const prevTasks = get().tasks
        const task = prevTasks.find((t) => t.id === id)
        if (!task) return

        const now = new Date().toISOString()
        const nextTasks =
          task.status === status
            ? reorderWithinColumn(prevTasks, id, order, now)
            : moveBetweenColumns(prevTasks, id, status, order, now)

        // Helpers return the same reference when nothing would change.
        if (nextTasks === prevTasks) return

        useUndoStore.getState().pushUndo('Task moved', () => {
          useTaskStore.setState({ tasks: prevTasks })
        })
        set({ tasks: nextTasks })
      },
      moveTasksToColumn: (taskIds, status) => {
        const prevTasks = get().tasks
        const nextTasks = applyMoveTasksToColumn(
          prevTasks,
          taskIds,
          status,
          new Date().toISOString()
        )
        if (nextTasks === prevTasks) return

        useUndoStore.getState().pushUndo(
          `${taskIds.length} task${taskIds.length > 1 ? 's' : ''} moved`,
          () => {
            useTaskStore.setState({ tasks: prevTasks })
          }
        )
        set({ tasks: nextTasks })
      },
      deleteTasksByWorkspace: (workspaceId) => {
        const deleted = get().tasks.filter((t) => t.workspaceId === workspaceId)
        if (deleted.length > 0) {
          useUndoStore.getState().pushUndo(
            `${deleted.length} task${deleted.length > 1 ? 's' : ''} deleted`,
            () => {
              useTaskStore.setState((s) => ({ tasks: [...s.tasks, ...deleted] }))
            }
          )
        }
        set((state) => ({
          tasks: state.tasks.filter((t) => t.workspaceId !== workspaceId),
        }))
      },
    }),
    { name: STORAGE_KEYS.TASKS, storage: createJSONStorage(() => safeStorage) }
  )
)
