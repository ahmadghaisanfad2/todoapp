import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

const PRESET_COLORS = [
  '#3B82F6', '#EF4444', '#22C55E', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
]

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  onSave: (data: { name: string; color: string }) => void
}

export function CategoryForm({ open, onOpenChange, category, onSave }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [color, setColor] = useState(category?.color ?? PRESET_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-semibold">{category ? 'Edit category' : 'New category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name" className="text-sm font-medium text-foreground">Name</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              autoFocus
              className="h-10 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label className="text-sm font-medium text-foreground">Color</Label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-9 w-9 rounded-full transition-all duration-150',
                    color === c && 'ring-2 ring-offset-2 ring-primary scale-110'
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="rounded-xl h-10 shadow-sm">
              {category ? 'Save changes' : 'Add category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
