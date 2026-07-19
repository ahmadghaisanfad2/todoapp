import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Trash2, Pencil, Check, X, Strikethrough } from 'lucide-react'
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
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateColumn(column.id, editName.trim())
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      data-kanban-column
      className={cn(
        'flex w-[min(18rem,calc(100vw-3rem))] shrink-0 snap-start flex-col rounded-2xl border border-border/70 bg-muted/40',
        isOver && 'border-primary/40 bg-primary/5 shadow-sm shadow-primary/5'
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
