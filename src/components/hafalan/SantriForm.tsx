import { useState, useCallback } from 'react'
import { Check, X } from 'lucide-react'
import { useHafalan } from '@/hooks/useHafalan'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SantriFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: { id: string; name: string; targetTaskIds: string[] }
}

function getDefaultState(
  initialData?: { id: string; name: string; targetTaskIds: string[] },
  allTaskIds?: string[]
) {
  if (initialData) {
    return { name: initialData.name, selectedTasks: [...initialData.targetTaskIds] }
  }
  return { name: '', selectedTasks: allTaskIds ?? [] }
}

export function SantriForm({ open, onOpenChange, initialData }: SantriFormProps) {
  const { tasks, addSantri, updateSantri } = useHafalan()
  const allTaskIds = tasks.map((t) => t.id)
  const [{ name, selectedTasks }, setState] = useState(() =>
    getDefaultState(initialData, allTaskIds)
  )

  const resetState = useCallback(() => {
    setState(getDefaultState(initialData, allTaskIds))
  }, [initialData, allTaskIds])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetState()
    onOpenChange(isOpen)
  }

  const handleSubmit = () => {
    if (!name.trim()) return

    if (initialData) {
      updateSantri(initialData.id, { name: name.trim(), targetTaskIds: selectedTasks })
    } else {
      addSantri({ name: name.trim(), targetTaskIds: selectedTasks })
    }
    handleOpenChange(false)
  }

  const toggleTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      selectedTasks: prev.selectedTasks.includes(taskId)
        ? prev.selectedTasks.filter((id) => id !== taskId)
        : [...prev.selectedTasks, taskId],
    }))
  }

  const allSelected = selectedTasks.length === tasks.length

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Santri' : 'Tambah Santri'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Ubah data santri dan target hafalan'
              : 'Semua tugas sudah dipilih. Hapus yang tidak diperlukan.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="santri-name">Nama Santri</Label>
            <Input
              id="santri-name"
              value={name}
              onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Masukkan nama santri"
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Target Hafalan</Label>
              <span className="text-xs text-muted-foreground">
                {selectedTasks.length}/{tasks.length} dipilih
              </span>
            </div>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Belum ada tugas hafalan. Buat dulu di tab "Tugas Hafalan".
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border p-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => {
                      if (allSelected) {
                        setState((prev) => ({ ...prev, selectedTasks: [] }))
                      } else {
                        setState((prev) => ({ ...prev, selectedTasks: allTaskIds }))
                      }
                    }}
                  />
                  <span className="text-sm font-medium">Pilih semua</span>
                </div>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2"
                    onClick={() => toggleTask(task.id)}
                  >
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span className="text-sm">{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            <X className="h-4 w-4 mr-1" />
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            <Check className="h-4 w-4 mr-1" />
            {initialData ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
