import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Trash2, Pencil, Check, X, Strikethrough, GripVertical } from 'lucide-react'
import { KanbanCard } from './KanbanCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Task, KanbanColumn as KanbanColumnType } from '@/types'

interface KanbanColumnProps {
  column: KanbanColumnType
  tasks: Task[]
  activeTaskId: string | null
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAddTask: (columnId: string) => void
  onUpdateColumn: (id: string, name: string) => void
  onDeleteColumn: (id: string) => void
  onToggleCrossTasks: (id: string) => void
}

export function KanbanColumnComponent({
  column,
  tasks,
  activeTaskId,
  onEdit,
  onDelete,
  onAddTask,
  onUpdateColumn,
  onDeleteColumn,
  onToggleCrossTasks,
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(column.name)
  const {
    setNodeRef,
    isOver,
    attributes,
    listeners,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateColumn(column.id, editName.trim())
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-kanban-column
      {...attributes}
      className={cn(
        'flex w-[min(18rem,calc(100vw-3rem))] shrink-0 snap-start flex-col rounded-2xl border border-border/70 bg-muted/40',
        isOver && 'border-primary/40 bg-primary/5 shadow-sm shadow-primary/5',
        isDragging && 'opacity-60'
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-3">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-1.5">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') {
                  setEditName(column.name)
                  setIsEditing(false)
                }
              }}
              className="h-9 flex-1 rounded-xl border border-border bg-background px-2.5 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl" onClick={handleSave}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl"
              onClick={() => {
                setEditName(column.name)
                setIsEditing(false)
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2">
              <button
                ref={setActivatorNodeRef}
                type="button"
                aria-label={`Drag ${column.name} column`}
                data-kanban-column-drag-handle
                className="shrink-0 cursor-grab rounded-md p-1 text-muted-foreground/50 hover:text-muted-foreground touch-none active:cursor-grabbing"
                {...listeners}
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <h2 className="truncate text-sm font-semibold tracking-tight">{column.name}</h2>
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-background/80 px-1.5 text-[10px] font-medium text-muted-foreground tabular-nums">
                {tasks.length}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                className={cn('h-8 w-8 rounded-lg', column.crossTasks && 'bg-primary/10 text-primary')}
                onClick={() => onToggleCrossTasks(column.id)}
                title={
                  column.crossTasks
                    ? 'Strikethrough on — tasks in this column appear crossed out'
                    : 'Strikethrough off — show tasks without crossing out'
                }
                aria-label={
                  column.crossTasks
                    ? `Disable strikethrough for ${column.name}`
                    : `Enable strikethrough for ${column.name}`
                }
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg"
                onClick={() => setIsEditing(true)}
                aria-label={`Rename ${column.name}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-destructive"
                onClick={() => onDeleteColumn(column.id)}
                aria-label={`Delete ${column.name} column`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div
        data-kanban-column-body
        className="kanban-scroll-y flex max-h-[min(62dvh,36rem)] flex-1 flex-col gap-2 overflow-y-auto overscroll-contain p-2.5"
        style={{ minHeight: 100 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-full justify-start gap-1.5 rounded-xl text-muted-foreground hover:bg-background/80 hover:text-foreground"
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task in ${column.name}`}
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>

        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              activeTaskId={activeTaskId}
              onEdit={onEdit}
              onDelete={onDelete}
              crossTasks={column.crossTasks}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

interface KanbanColumnOverlayProps {
  column: KanbanColumnType
  taskCount: number
}

export function KanbanColumnOverlay({ column, taskCount }: KanbanColumnOverlayProps) {
  return (
    <div
      data-kanban-column-overlay
      className="flex w-[min(18rem,calc(100vw-3rem))] shrink-0 flex-col rounded-2xl border border-primary/30 bg-card px-3 py-3 shadow-lg cursor-grabbing select-none"
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
        <h2 className="truncate text-sm font-semibold tracking-tight">{column.name}</h2>
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-background/80 px-1.5 text-[10px] font-medium text-muted-foreground tabular-nums">
          {taskCount}
        </span>
      </div>
    </div>
  )
}
