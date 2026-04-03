import { useState } from 'react'
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
  { value: 'high', label: 'High', className: 'border-red-300 text-red-600 dark:border-red-800 dark:text-red-400' },
  { value: 'medium', label: 'Medium', className: 'border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400' },
  { value: 'low', label: 'Low', className: 'border-emerald-300 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400' },
]

export function TaskForm({ open, onOpenChange, task }: TaskFormProps) {
  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const { categories } = useCategories()

  const [title, setTitle] = useState(task?.title ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'low')
  const [categoryId, setCategoryId] = useState<string>(task?.categoryId ?? 'none')
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? parseISO(task.dueDate) : undefined)
  const [calOpen, setCalOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload = {
      title: title.trim(),
      priority,
      categoryId: categoryId === 'none' ? null : categoryId,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd'T'HH:mm:ss") : null,
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
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-xl font-semibold">{task ? 'Edit task' : 'New task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title" className="text-sm font-medium text-foreground">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              className="h-10 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Priority</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  data-selected={priority === p.value}
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    'flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-150',
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
                <SelectTrigger className="h-10 rounded-xl">
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
            <div className="flex gap-2">
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('justify-start text-left font-normal flex-1 h-10 rounded-xl', !dueDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : 'Pick date'}
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
                  className="w-28 rounded-xl h-10"
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
                className="mt-1 inline-flex items-center gap-1 text-left text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => setDueDate(undefined)}
              >
                Clear date & time
              </button>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()} className="rounded-xl h-10 shadow-sm">
              {task ? 'Save changes' : 'Add task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
