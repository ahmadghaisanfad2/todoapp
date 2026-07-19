import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Calendar, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, parseISO, isPast } from 'date-fns'
import { useCoarsePointer } from '@/hooks/useCoarsePointer'
import type { Task, Priority } from '@/types'

interface KanbanCardProps {
  task: Task
  activeTaskId: string | null
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  crossTasks?: boolean
}

interface KanbanCardContentProps {
  task: Task
  crossTasks?: boolean
  onDelete?: (id: string) => void
  onRequestDelete?: () => void
  showDelete?: boolean
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
}

function KanbanCardContent({ task, crossTasks, onDelete, onRequestDelete, showDelete = true }: KanbanCardContentProps) {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed

  return (
    <>
      <div className="min-w-0 flex-1 pointer-events-none">
        <p className={cn(
          'text-sm font-medium leading-snug tracking-tight',
          (task.completed || crossTasks) && 'line-through opacity-60'
        )}>
          {task.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={cn(
            'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize',
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={cn(
              'inline-flex items-center gap-1 text-[10px] text-muted-foreground',
              isOverdue && 'font-medium text-red-600 dark:text-red-400'
            )}>
              <Calendar className="h-3 w-3" />
              {format(parseISO(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
      </div>
      {showDelete && (onDelete || onRequestDelete) && (
        <button
          type="button"
          aria-label={`Delete ${task.title}`}
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-100 transition-colors hover:bg-destructive/10 hover:text-destructive sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100 pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation()
            if (onRequestDelete) {
              onRequestDelete()
              return
            }
            onDelete?.(task.id)
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </>
  )
}

export function KanbanCard({ task, activeTaskId, onEdit, onDelete, crossTasks }: KanbanCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const dragFromWholeCard = useCoarsePointer()
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const isBeingDragged = isDragging || activeTaskId === task.id

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isBeingDragged ? 0 : undefined,
    animation: isBeingDragged ? 'none' : undefined,
  }

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed

  const handleClick = (e: React.MouseEvent) => {
    if (isBeingDragged) return
    if ((e.target as HTMLElement).closest('button')) return
    onEdit(task)
  }

  const mobileListeners = dragFromWholeCard
    ? {
        ...listeners,
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          if ((e.target as HTMLElement).closest('button')) return
          listeners?.onPointerDown?.(e)
        },
      }
    : {}

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-kanban-card
      data-kanban-card-touch-drag={dragFromWholeCard ? 'true' : undefined}
      className={cn(
        'group flex items-start gap-2 rounded-2xl border border-border/70 bg-card px-3 py-3 shadow-sm transition-all duration-150 select-none animate-card-in hover:border-primary/30 active:scale-[0.99]',
        isBeingDragged && 'pointer-events-none',
        isOverdue && 'border-red-300 dark:border-red-800',
        dragFromWholeCard ? 'cursor-grab touch-none active:cursor-grabbing' : undefined
      )}
      {...attributes}
      {...mobileListeners}
      onClick={handleClick}
    >
      <button
        ref={dragFromWholeCard ? undefined : setActivatorNodeRef}
        type="button"
        aria-label={`Drag ${task.title}`}
        data-kanban-drag-handle
        className={cn(
          'kanban-drag-handle -ml-0.5 mt-0.5 shrink-0 rounded-md p-1 text-muted-foreground/50 hover:text-muted-foreground',
          dragFromWholeCard ? 'pointer-events-none' : 'cursor-grab touch-none active:cursor-grabbing'
        )}
        {...(!dragFromWholeCard ? listeners : {})}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <KanbanCardContent
        task={task}
        crossTasks={crossTasks}
        onDelete={onDelete}
        onRequestDelete={() => setDeleteOpen(true)}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-[380px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete task</DialogTitle>
            <DialogDescription>
              Delete &ldquo;{task.title}&rdquo;? You can undo from the toast or with your keyboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="h-10 rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id)
                setDeleteOpen(false)
              }}
              className="h-10 rounded-xl"
            >
              Delete task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface KanbanCardOverlayProps {
  task: Task
  crossTasks?: boolean
}

export function KanbanCardOverlay({ task, crossTasks }: KanbanCardOverlayProps) {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed

  return (
    <div
      data-kanban-card-overlay
      className={cn(
        'group flex w-[min(18rem,calc(100vw-3rem))] items-start gap-2 rounded-2xl border border-border/70 bg-card px-3 py-3 shadow-lg cursor-grabbing select-none',
        isOverdue && 'border-red-300 dark:border-red-800'
      )}
    >
      <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
      <KanbanCardContent task={task} crossTasks={crossTasks} showDelete={false} />
    </div>
  )
}
