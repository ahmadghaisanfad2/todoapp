import { useCategoryStore } from '@/store/categoryStore'

export function useCategories() {
  const categories = useCategoryStore((s) => s.categories)
  const addCategory = useCategoryStore((s) => s.addCategory)
  const updateCategory = useCategoryStore((s) => s.updateCategory)
  const deleteCategory = useCategoryStore((s) => s.deleteCategory)

  const getCategoryById = (id: string | null) =>
    id ? categories.find((c) => c.id === id) : undefined

  const getCategoryColor = (id: string | null): string =>
    getCategoryById(id)?.color ?? '#6B7280'

  return { categories, addCategory, updateCategory, deleteCategory, getCategoryById, getCategoryColor }
}
