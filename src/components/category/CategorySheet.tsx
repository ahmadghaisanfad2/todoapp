import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2">
            {categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No categories yet. Add one below!
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 text-sm font-medium">{category.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Separator className="my-2" />
            <Button onClick={handleAdd} className="w-full">
              Add Category
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSave={handleSave}
      />
    </>
  )
}
