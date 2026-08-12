import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'

export const taskQueryKeys = {
  all: ['tasks'] as const,
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'> & {
  status?: string
}

function getTasks(): Task[] {
  return useTaskStore.getState().tasks
}

function invalidateTasks(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: taskQueryKeys.all })
}

/** Reads persisted tasks through TanStack Query's cache. */
export function useTaskQuery() {
  return useQuery({
    queryKey: taskQueryKeys.all,
    queryFn: getTasks,
    initialData: getTasks,
  })
}

/** Exposes task writes as TanStack Query mutations while preserving local undo behavior. */
export function useTaskMutations() {
  const queryClient = useQueryClient()

  const addTaskMutation = useMutation({
    mutationFn: async (task: TaskDraft) => {
      useTaskStore.getState().addTask(task)
    },
    onSuccess: () => invalidateTasks(queryClient),
  })
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> }) => {
      useTaskStore.getState().updateTask(id, updates)
    },
    onSuccess: () => invalidateTasks(queryClient),
  })
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      useTaskStore.getState().deleteTask(id)
    },
    onSuccess: () => invalidateTasks(queryClient),
  })
  const toggleTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      useTaskStore.getState().toggleTask(id)
    },
    onSuccess: () => invalidateTasks(queryClient),
  })
  const moveTaskMutation = useMutation({
    mutationFn: async ({ id, status, order }: { id: string; status: string; order: number }) => {
      useTaskStore.getState().moveTask(id, status, order)
    },
    onSuccess: () => invalidateTasks(queryClient),
  })
  const moveTasksToColumnMutation = useMutation({
    mutationFn: async ({ taskIds, status }: { taskIds: string[]; status: string }) => {
      useTaskStore.getState().moveTasksToColumn(taskIds, status)
    },
    onSuccess: () => invalidateTasks(queryClient),
  })
  const deleteTasksByWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      useTaskStore.getState().deleteTasksByWorkspace(workspaceId)
    },
    onSuccess: () => invalidateTasks(queryClient),
  })

  return {
    addTask: (task: TaskDraft) => addTaskMutation.mutate(task),
    updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) =>
      updateTaskMutation.mutate({ id, updates }),
    deleteTask: (id: string) => deleteTaskMutation.mutate(id),
    toggleTask: (id: string) => toggleTaskMutation.mutate(id),
    moveTask: (id: string, status: string, order: number) =>
      moveTaskMutation.mutate({ id, status, order }),
    moveTasksToColumn: (taskIds: string[], status: string) =>
      moveTasksToColumnMutation.mutate({ taskIds, status }),
    deleteTasksByWorkspace: (workspaceId: string) =>
      deleteTasksByWorkspaceMutation.mutate(workspaceId),
    isPending:
      addTaskMutation.isPending ||
      updateTaskMutation.isPending ||
      deleteTaskMutation.isPending ||
      toggleTaskMutation.isPending ||
      moveTaskMutation.isPending ||
      moveTasksToColumnMutation.isPending ||
      deleteTasksByWorkspaceMutation.isPending,
  }
}
