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
        'flex w-72 shrink-0 flex-col rounded-lg border bg-muted/50',
        isOver && 'border-primary/50 bg-primary/5'
      )}
    >
      <div className="flex items-center justify-between border-b px-3 py-2.5">
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
              className="flex-1 rounded border bg-background px-2 py-1 text-sm font-semibold outline-none focus:border-primary"
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
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
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{column.name}</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                {tasks.length}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                className={cn('h-7 w-7', column.crossTasks && 'text-primary bg-primary/10')}
                onClick={() => onToggleCrossTasks(column.id)}
                aria-label={`Toggle cross tasks for ${column.name}`}
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive"
                onClick={() => onDeleteColumn(column.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div
        data-kanban-column-body
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
        style={{ minHeight: 100 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task in ${column.name}`}
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>

        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} crossTasks={column.crossTasks} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
