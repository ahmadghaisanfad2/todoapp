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
        'flex items-start gap-3 rounded-lg border bg-card px-4 py-3.5 shadow-sm transition-colors',
        task.completed && 'opacity-60',
        overdue && !task.completed && 'border-red-300 dark:border-red-800'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-0.5 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'cursor-pointer text-sm font-medium leading-snug',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </label>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {category && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
              {category.name}
            </span>
          )}
          {task.dueDate && (
            <span
              className={cn(
                'text-xs',
                overdue && !task.completed ? 'font-medium text-red-600 dark:text-red-400' : 'text-muted-foreground'
              )}
            >
              {overdue && !task.completed ? '⚠ Overdue · ' : ''}
              {format(parseISO(task.dueDate), 'MMM d · h:mm a')}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <PriorityBadge priority={task.priority} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
