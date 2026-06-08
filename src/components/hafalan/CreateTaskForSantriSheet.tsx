import { useState, useCallback } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { useHafalanTaskStore } from '@/store/hafalanTaskStore'
import { useSantriStore } from '@/store/santriStore'
import { generateId } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface CreateTaskForSantriSheetProps {
  santriId: string
  santriName: string
}

export function CreateTaskForSantriSheet({ santriId, santriName }: CreateTaskForSantriSheetProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const resetState = useCallback(() => {
    setTitle('')
    setDescription('')
  }, [])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetState()
    setOpen(isOpen)
  }

  const handleSubmit = () => {
    if (!title.trim()) return

    const newId = generateId()
    useHafalanTaskStore.setState((state) => ({
      tasks: [
        ...state.tasks,
        {
          title: title.trim(),
          description: description.trim() || null,
          id: newId,
          personalFor: santriId,
          createdAt: new Date().toISOString(),
        },
      ],
    }))

    useSantriStore.setState((state) => ({
      santri: state.santri.map((s) =>
        s.id === santriId
          ? { ...s, targetTaskIds: [...s.targetTaskIds, newId] }
          : s
      ),
    }))

    handleOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          <Plus className="h-3 w-3 mr-1" />
          Buat tugas baru khusus {santriName}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tugas Baru untuk {santriName}</SheetTitle>
          <SheetDescription>
            Tugas ini hanya akan di-assign ke {santriName}, bukan ke santri lain
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-6">
          <div>
            <Label htmlFor="new-task-title">Judul Tugas</Label>
            <Input
              id="new-task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Hafalan Kosakata Bab 5"
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="new-task-desc">Keterangan (opsional)</Label>
            <Input
              id="new-task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail tambahan..."
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            <X className="h-4 w-4 mr-1" />
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            <Check className="h-4 w-4 mr-1" />
            Buat & Assign
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
