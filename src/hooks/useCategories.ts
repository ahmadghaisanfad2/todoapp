import { useMemo } from 'react'
import { useCategoryStore } from '@/store/categoryStore'
import { useWorkspaceStore } from '@/store/workspaceStore'

export function useCategories() {
  const allCategories = useCategoryStore((s) => s.categories)
  const addCategory = useCategoryStore((s) => s.addCategory)
  const updateCategory = useCategoryStore((s) => s.updateCategory)
  const deleteCategory = useCategoryStore((s) => s.deleteCategory)
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)

  const categories = useMemo(
    () => allCategories.filter((c) => c.workspaceId === activeWorkspaceId),
    [allCategories, activeWorkspaceId]
  )

  const getCategoryById = (id: string | null) =>
    id ? allCategories.find((c) => c.id === id) : undefined

  const getCategoryColor = (id: string | null): string =>
    getCategoryById(id)?.color ?? '#6B7280'

  return { categories, addCategory, updateCategory, deleteCategory, getCategoryById, getCategoryColor }
}
