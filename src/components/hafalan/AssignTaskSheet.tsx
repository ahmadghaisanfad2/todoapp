import { useState, useCallback } from 'react'
import { Plus, Check, BookOpen, CheckCircle2 } from 'lucide-react'
import { useHafalan } from '@/hooks/useHafalan'
import { useSantriStore } from '@/store/santriStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface AssignTaskSheetProps {
  santriId: string
  santriName: string
}

export function AssignTaskSheet({ santriId, santriName }: AssignTaskSheetProps) {
  const { updateSantri, getUnassignedTasks } = useHafalan()
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const unassignedTasks = getUnassignedTasks(santriId)
  const allAssigned = unassignedTasks.length === 0

  const resetState = useCallback(() => {
    setSelectedIds([])
  }, [])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetState()
    setOpen(isOpen)
  }

  const toggleTask = (taskId: string) => {
    setSelectedIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleAssign = () => {
    if (selectedIds.length === 0) return
    const currentSantri = useSantriStore.getState().santri.find((s) => s.id === santriId)
    if (!currentSantri) return
    updateSantri(santriId, {
      targetTaskIds: [...currentSantri.targetTaskIds, ...selectedIds],
    })
    handleOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" disabled={allAssigned}>
          {allAssigned ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Semua Ter-assign
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Tugas
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Tugas untuk {santriName}</SheetTitle>
          <SheetDescription>
            Pilih tugas hafalan yang ingin di-assign ke santri ini
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-3">
          {unassignedTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Semua tugas sudah di-assign</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tidak ada tugas tambahan yang tersedia
              </p>
            </div>
          ) : (
            unassignedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleTask(task.id)}
              >
                <Checkbox
                  checked={selectedIds.includes(task.id)}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {unassignedTasks.length > 0 && (
          <SheetFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleAssign} disabled={selectedIds.length === 0}>
              <Check className="h-4 w-4 mr-1" />
              Assign ({selectedIds.length})
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
