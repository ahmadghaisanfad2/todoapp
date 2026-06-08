import { useState, useCallback } from 'react'
import { Check, X } from 'lucide-react'
import { useHafalan } from '@/hooks/useHafalan'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface HafalanTaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: { id: string; title: string; description: string | null }
}

function getDefaultState(initialData?: { id: string; title: string; description: string | null }) {
  if (initialData) {
    return { title: initialData.title, description: initialData.description ?? '' }
  }
  return { title: '', description: '' }
}

export function HafalanTaskForm({ open, onOpenChange, initialData }: HafalanTaskFormProps) {
  const { addTask, updateTask } = useHafalan()
  const [{ title, description }, setState] = useState(() => getDefaultState(initialData))

  const resetState = useCallback(() => {
    setState(getDefaultState(initialData))
  }, [initialData])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetState()
    onOpenChange(isOpen)
  }

  const handleSubmit = () => {
    if (!title.trim()) return

    if (initialData) {
      updateTask(initialData.id, {
        title: title.trim(),
        description: description.trim() || null,
      })
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || null,
      })
    }
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Tugas Hafalan' : 'Tambah Tugas Hafalan'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Ubah tugas hafalan'
              : 'Tambahkan tugas hafalan baru (misal: Juz 30, Al-Fatihah, Kosakata Bab 1)'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="task-title">Judul</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Juz 30, Al-Fatihah ayat 1-7"
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="task-desc">Keterangan (opsional)</Label>
            <Input
              id="task-desc"
              value={description}
              onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detail tambahan..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            <X className="h-4 w-4 mr-1" />
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            <Check className="h-4 w-4 mr-1" />
            {initialData ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
