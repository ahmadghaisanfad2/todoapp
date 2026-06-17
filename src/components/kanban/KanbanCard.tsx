import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Calendar, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, parseISO, isPast } from 'date-fns'
import type { Task, Priority } from '@/types'

interface KanbanCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  crossTasks?: boolean
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export function KanbanCard({ task, onEdit, onDelete, crossTasks }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return
    if ((e.target as HTMLElement).closest('button')) return
    onEdit(task)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-kanban-card
      className={cn(
        'group flex items-start gap-2 rounded-lg border bg-card px-3 py-2.5 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors select-none animate-card-in',
        isDragging && 'opacity-50 shadow-lg z-50',
        isOverdue && 'border-red-300 dark:border-red-800'
      )}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
      <div className="flex-1 min-w-0 pointer-events-none">
        <p className={cn('text-sm font-medium leading-snug', (task.completed || crossTasks) && 'line-through opacity-60')}>
          {task.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium', priorityColors[task.priority])}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={cn('inline-flex items-center gap-1 text-[10px] text-muted-foreground', isOverdue && 'text-red-500')}>
              <Calendar className="h-3 w-3" />
              {format(parseISO(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label={`Delete ${task.title}`}
        className="opacity-0 group-hover:opacity-100 mt-0.5 text-muted-foreground hover:text-destructive transition-opacity pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
