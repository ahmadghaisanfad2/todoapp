import { useState, useEffect } from 'react'
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
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '')
      setColor(category?.color ?? PRESET_COLORS[0])
    }
  }, [open, category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-8 w-8 rounded-full transition-transform hover:scale-110',
                    color === c && 'ring-2 ring-offset-2 ring-ring scale-110'
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {category ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
