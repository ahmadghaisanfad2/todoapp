import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Task } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'
import { useUndoStore } from '@/store/undoStore'

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[taskStore] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[taskStore] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[taskStore] Failed to remove from localStorage: ${name}`)
    }
  },
}

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'> & { status?: string }) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  moveTask: (id: string, status: string, order: number) => void
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

        const sourceStatus = task.status
        const destStatus = status
        const targetIndex = order
        const now = new Date().toISOString()

        const sortByOrder = (items: Task[]) => [...items].sort((a, b) => a.order - b.order)

        let nextTasks: Task[]

        if (sourceStatus === destStatus) {
          const columnTasks = sortByOrder(prevTasks.filter((t) => t.status === sourceStatus))
          const fromIndex = columnTasks.findIndex((t) => t.id === id)
          if (fromIndex === -1 || fromIndex === targetIndex) return

          const reordered = [...columnTasks]
          const [removed] = reordered.splice(fromIndex, 1)
          reordered.splice(targetIndex, 0, removed)

          const orderById = new Map(reordered.map((t, index) => [t.id, index]))
          nextTasks = prevTasks.map((t) => {
            const newOrder = orderById.get(t.id)
            if (newOrder === undefined) return t
            return {
              ...t,
              order: newOrder,
              completed: destStatus === 'done',
              updatedAt: now,
            }
          })
        } else {
          const sourceTasks = sortByOrder(prevTasks.filter((t) => t.status === sourceStatus && t.id !== id))
          const destTasks = sortByOrder(prevTasks.filter((t) => t.status === destStatus && t.id !== id))
          const clampedIndex = Math.min(Math.max(0, targetIndex), destTasks.length)
          destTasks.splice(clampedIndex, 0, { ...task, status: destStatus })

          const sourceOrderById = new Map(sourceTasks.map((t, index) => [t.id, index]))
          const destOrderById = new Map(destTasks.map((t, index) => [t.id, index]))

          nextTasks = prevTasks.map((t) => {
            if (t.id === id) {
              return {
                ...t,
                status: destStatus,
                order: clampedIndex,
                completed: destStatus === 'done',
                updatedAt: now,
              }
            }
            if (t.status === sourceStatus) {
              const newOrder = sourceOrderById.get(t.id)
              if (newOrder === undefined) return t
              return { ...t, order: newOrder, updatedAt: now }
            }
            if (t.status === destStatus) {
              const newOrder = destOrderById.get(t.id)
              if (newOrder === undefined) return t
              return { ...t, order: newOrder, updatedAt: now }
            }
            return t
          })
        }

        useUndoStore.getState().pushUndo('Task moved', () => {
          useTaskStore.setState({ tasks: prevTasks })
        })
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
