import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCategories } from '@/hooks/useCategories'
import { CategoryForm } from './CategoryForm'
import type { Category } from '@/types'

interface CategorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategorySheet({ open, onOpenChange }: CategorySheetProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleAdd = () => {
    setEditingCategory(undefined)
    setFormOpen(true)
  }

  const handleSave = (data: { name: string; color: string }) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data)
    } else {
      addCategory(data)
    }
    setFormOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this category? Tasks in this category will become uncategorized.')) {
      deleteCategory(id)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-80 sm:max-w-sm rounded-l-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-lg font-semibold">Categories</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-sm text-muted-foreground">No categories yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Add one to organize your tasks</p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm"
                >
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 text-sm font-medium text-foreground truncate">{category.name}</span>
                  <div className="flex gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive/60 hover:text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Separator className="my-2" />
            <Button onClick={handleAdd} className="w-full h-10 rounded-xl shadow-sm gap-1.5">
              <Plus className="h-4 w-4" />
              Add category
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <CategoryForm
        key={editingCategory?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSave={handleSave}
      />
    </>
  )
}
