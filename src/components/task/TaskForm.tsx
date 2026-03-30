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
import { useTaskStore } from '@/store/taskStore'
import { useCategories } from '@/hooks/useCategories'
import type { Task, Priority } from '@/types'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
}

const PRIORITIES: { value: Priority; label: string; className: string }[] = [
  { value: 'high', label: 'High', className: 'border-red-400 text-red-600 data-[selected=true]:bg-red-100 dark:data-[selected=true]:bg-red-900/30' },
  { value: 'medium', label: 'Medium', className: 'border-amber-400 text-amber-600 data-[selected=true]:bg-amber-100 dark:data-[selected=true]:bg-amber-900/30' },
  { value: 'low', label: 'Low', className: 'border-green-400 text-green-600 data-[selected=true]:bg-green-100 dark:data-[selected=true]:bg-green-900/30' },
]

export function TaskForm({ open, onOpenChange, task }: TaskFormProps) {
  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const { categories } = useCategories()

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('low')
  const [categoryId, setCategoryId] = useState<string>('none')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [calOpen, setCalOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? '')
      setPriority(task?.priority ?? 'low')
      setCategoryId(task?.categoryId ?? 'none')
      setDueDate(task?.dueDate ? parseISO(task.dueDate) : undefined)
    }
  }, [open, task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload = {
      title: title.trim(),
      priority,
      categoryId: categoryId === 'none' ? null : categoryId,
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
      completed: task?.completed ?? false,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  data-selected={priority === p.value}
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    'flex-1 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors',
                    p.className,
                    priority === p.value ? 'ring-2 ring-ring ring-offset-1' : 'opacity-60 hover:opacity-100'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="No category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Due Date</Label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('justify-start text-left font-normal', !dueDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(d) => { setDueDate(d); setCalOpen(false) }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <button
                type="button"
                className="mt-1 inline-flex items-center gap-1 text-left text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-destructive"
                onClick={() => setDueDate(undefined)}
              >
                Clear date
              </button>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {task ? 'Save' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
