import { useState } from 'react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { BookOpen, CheckCircle, Repeat, PlusCircle } from 'lucide-react'
import { useHafalan } from '@/hooks/useHafalan'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { LogType } from '@/types'

interface SetoranSheetProps {
  santriId: string
  taskId: string
  taskTitle: string
}

export function SetoranSheet({ santriId, taskId, taskTitle }: SetoranSheetProps) {
  const { addLog, getTaskStatus } = useHafalan()
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<LogType>('setor')
  const [notes, setNotes] = useState('')

  const status = getTaskStatus(santriId, taskId)

  const handleSubmit = () => {
    addLog({
      santriId,
      taskId,
      type: selectedType,
      timestamp: new Date().toISOString(),
      notes: notes.trim() || null,
    })
    setNotes('')
    setOpen(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setNotes('')
    }
    setOpen(isOpen)
  }

  const logTypes: { value: LogType; label: string; icon: typeof BookOpen; color: string }[] = [
    {
      value: 'setor',
      label: 'Setoran',
      icon: CheckCircle,
      color: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    },
    {
      value: 'murajaah',
      label: "Muraja'ah",
      icon: Repeat,
      color: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    },
    {
      value: 'ziyadah',
      label: 'Ziyadah',
      icon: PlusCircle,
      color: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    },
  ]

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen className="h-3.5 w-3.5 mr-1" />
          {status === 'completed' ? 'Setor lagi' : 'Setoran'}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Log Setoran</SheetTitle>
          <SheetDescription>
            {taskTitle} — {format(new Date(), 'EEEE, dd MMMM yyyy, HH:mm', { locale: idLocale })}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div>
            <Label>Tipe Setoran</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {logTypes.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedType(value)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-xs font-medium transition-all ${
                    selectedType === value
                      ? color
                      : 'border-border text-muted-foreground hover:border-foreground/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="setoran-notes">Catatan (opsional)</Label>
            <Textarea
              id="setoran-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Lancar, ada sedikit kesalahan di ayat 3..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Simpan Log
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
