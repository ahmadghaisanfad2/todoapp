import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Workspace } from '@/types'

const PRESET_COLORS: { hex: string; name: string }[] = [
  { hex: '#6366F1', name: 'Indigo' },
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#06B6D4', name: 'Cyan' },
  { hex: '#22C55E', name: 'Green' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#EF4444', name: 'Red' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#8B5CF6', name: 'Purple' },
]

interface WorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace?: Workspace
  onSave: (data: { name: string; color: string }) => void
}

export function WorkspaceDialog({ open, onOpenChange, workspace, onSave }: WorkspaceDialogProps) {
  const [name, setName] = useState(workspace?.name ?? '')
  const [color, setColor] = useState(workspace?.color ?? PRESET_COLORS[0].hex)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-semibold">
            {workspace ? 'Edit workspace' : 'New workspace'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {workspace ? 'Update workspace name and color.' : 'Create a workspace to organize your tasks.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ws-name" className="text-sm font-medium text-foreground">Name</Label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work, Personal, Side Project"
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
              {workspace ? 'Save changes' : 'Create workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
