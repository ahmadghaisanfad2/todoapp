import { format, parseISO } from 'date-fns'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { useCategories } from '@/hooks/useCategories'
import { isTaskOverdue } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onToggle, onDelete }: TaskCardProps) {
  const { getCategoryById } = useCategories()
  const category = getCategoryById(task.categoryId)
  const overdue = isTaskOverdue(task)

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card px-4 py-3.5 shadow-sm transition-all duration-150',
        task.completed && 'opacity-55',
        overdue && !task.completed && 'border-red-200 dark:border-red-900/60 shadow-red-100/30 dark:shadow-red-900/10'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-0.5 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'cursor-pointer text-sm font-medium leading-snug text-foreground transition-opacity',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </label>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {category && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
              <span>{category.name}</span>
            </span>
          )}
          {task.dueDate && (
            <span
              className={cn(
                'text-xs',
                overdue && !task.completed ? 'font-medium text-red-600 dark:text-red-400' : 'text-muted-foreground'
              )}
            >
              {overdue && !task.completed ? 'Overdue · ' : ''}
              {format(parseISO(task.dueDate), 'MMM d · h:mm a')}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <PriorityBadge priority={task.priority} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
