import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

const PRESET_COLORS: { hex: string; name: string }[] = [
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#EF4444', name: 'Red' },
  { hex: '#22C55E', name: 'Green' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#8B5CF6', name: 'Purple' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#06B6D4', name: 'Cyan' },
  { hex: '#F97316', name: 'Orange' },
]

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  onSave: (data: { name: string; color: string }) => void
}

export function CategoryForm({ open, onOpenChange, category, onSave }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [color, setColor] = useState(category?.color ?? PRESET_COLORS[0].hex)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-semibold">{category ? 'Edit category' : 'Add category'}</DialogTitle>
          <DialogDescription className="sr-only">
            {category ? 'Update this category name and color.' : 'Create a category to organize tasks.'}
          </DialogDescription>
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
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={cn(
                    'h-9 w-9 rounded-full transition-all duration-150',
                    color === c.hex && 'ring-2 ring-offset-2 ring-primary scale-110'
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
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
