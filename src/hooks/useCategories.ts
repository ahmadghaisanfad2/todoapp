import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCategoryStore } from '@/store/categoryStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import type { Category } from '@/types'

export const categoryQueryKeys = {
  all: ['categories'] as const,
}

type CategoryDraft = Omit<Category, 'id' | 'createdAt'>

function getCategories(): Category[] {
  return useCategoryStore.getState().categories
}

export function useCategories() {
  const queryClient = useQueryClient()
  const categoriesQuery = useQuery({
    queryKey: categoryQueryKeys.all,
    queryFn: getCategories,
    initialData: getCategories,
  })
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)

  const addCategoryMutation = useMutation({
    mutationFn: async (category: CategoryDraft) => {
      useCategoryStore.getState().addCategory(category)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  })
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Category, 'id' | 'createdAt'>> }) => {
      useCategoryStore.getState().updateCategory(id, updates)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  })
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      useCategoryStore.getState().deleteCategory(id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  })
  const deleteCategoriesByWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      useCategoryStore.getState().deleteCategoriesByWorkspace(workspaceId)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  })

  const categories = useMemo(
    () => (categoriesQuery.data ?? []).filter((c) => c.workspaceId === activeWorkspaceId),
    [categoriesQuery.data, activeWorkspaceId]
  )

  const getCategoryById = (id: string | null) =>
    id ? (categoriesQuery.data ?? []).find((c) => c.id === id) : undefined

  const getCategoryColor = (id: string | null): string =>
    getCategoryById(id)?.color ?? '#6B7280'

  return {
    categories,
    addCategory: (category: CategoryDraft) => addCategoryMutation.mutate(category),
    updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) =>
      updateCategoryMutation.mutate({ id, updates }),
    deleteCategory: (id: string) => deleteCategoryMutation.mutate(id),
    deleteCategoriesByWorkspace: (workspaceId: string) =>
      deleteCategoriesByWorkspaceMutation.mutate(workspaceId),
    getCategoryById,
    getCategoryColor,
  }
}
