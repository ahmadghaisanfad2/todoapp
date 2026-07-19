import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { NotesEditor } from '@/components/task/NotesEditor'
import { useTaskStore } from '@/store/taskStore'
import { useKanbanStore } from '@/store/kanbanStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useCategories } from '@/hooks/useCategories'
import type { Task, Priority } from '@/types'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  defaultStatus?: string
}

const PRIORITIES: { value: Priority; label: string; className: string }[] = [
  { value: 'high', label: 'High', className: 'border-red-300 text-red-600 dark:border-red-800 dark:text-red-400' },
  { value: 'medium', label: 'Medium', className: 'border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400' },
  { value: 'low', label: 'Low', className: 'border-emerald-300 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400' },
]

export function TaskForm({ open, onOpenChange, task, defaultStatus }: TaskFormProps) {
  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const columns = useKanbanStore((s) => s.columns)
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)
  const { categories } = useCategories()

  const [title, setTitle] = useState(task?.title ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'low')
  const [categoryId, setCategoryId] = useState<string>(task?.categoryId ?? 'none')
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? parseISO(task.dueDate) : undefined)
  const [status, setStatus] = useState(task?.status || defaultStatus || 'todo')
  const [notes, setNotes] = useState(task?.notes ?? '')
  const [calOpen, setCalOpen] = useState(false)

  const defaultColumnId = [...columns].sort((a, b) => a.order - b.order)[0]?.id ?? 'todo'

  useEffect(() => {
    if (!open) return

    queueMicrotask(() => {
      if (task) {
        setTitle(task.title)
        setPriority(task.priority)
        setCategoryId(task.categoryId ?? 'none')
        setDueDate(task.dueDate ? parseISO(task.dueDate) : undefined)
        setStatus(task.status)
        setNotes(task.notes ?? '')
        return
      }

      const nextStatus = defaultStatus ?? defaultColumnId
      setTitle('')
      setPriority('low')
      setCategoryId('none')
      setDueDate(undefined)
      setStatus(nextStatus)
      setNotes('')
    })
  }, [open, task, defaultStatus, defaultColumnId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload = {
      title: title.trim(),
      notes: notes.trim() || null,
      priority,
      categoryId: categoryId === 'none' ? null : categoryId,
      workspaceId: task?.workspaceId ?? activeWorkspaceId,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd'T'HH:mm:ss") : null,
      completed: task?.completed ?? false,
      status,
    }
    if (task) {
      updateTask(task.id, payload)
    } else {
      addTask(payload)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,44rem)] w-[calc(100%-1.25rem)] max-w-lg flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:w-full">
        <DialogHeader className="shrink-0 border-b border-border/60 px-5 pb-4 pt-5 pr-12 text-left sm:px-6">
          <DialogTitle className="text-lg font-semibold tracking-tight sm:text-xl">
            {task ? 'Edit task' : 'Add task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-title" className="text-sm font-medium text-foreground">Title</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="h-11 rounded-xl text-base sm:h-10 sm:text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="task-notes" className="text-sm font-medium text-foreground">Notes</Label>
              <NotesEditor value={notes} onChange={setNotes} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">Priority</Label>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    data-selected={priority === p.value}
                    onClick={() => setPriority(p.value)}
                    className={cn(
                      'rounded-xl border-2 px-2 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.97] sm:px-4',
                      p.className,
                      priority === p.value
                        ? 'bg-card shadow-sm ring-2 ring-primary/20'
                        : 'opacity-50 hover:opacity-80'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-11 rounded-xl sm:h-10">
                    <SelectValue placeholder="No category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">Due date & time</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-11 justify-start rounded-xl text-left font-normal sm:h-10 sm:flex-1',
                        !dueDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{dueDate ? format(dueDate, 'PPP') : 'Pick date'}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(d) => {
                        if (d) {
                          const newDate = dueDate ? new Date(dueDate) : new Date()
                          newDate.setFullYear(d.getFullYear(), d.getMonth(), d.getDate())
                          setDueDate(newDate)
                        }
                        setCalOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {dueDate && (
                  <Input
                    type="time"
                    className="h-11 w-full rounded-xl sm:h-10 sm:w-28"
                    value={format(dueDate, 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number)
                      const newDate = new Date(dueDate)
                      newDate.setHours(hours, minutes, 0, 0)
                      setDueDate(newDate)
                    }}
                  />
                )}
              </div>
              {dueDate && (
                <button
                  type="button"
                  className="mt-0.5 inline-flex items-center gap-1 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                  onClick={() => setDueDate(undefined)}
                >
                  Clear date & time
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 rounded-xl sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="shrink-0 gap-2 border-t border-border/60 bg-background px-5 py-4 sm:space-x-0 sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl sm:h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="h-11 rounded-xl shadow-sm sm:h-10"
            >
              {task ? 'Save changes' : 'Add task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
