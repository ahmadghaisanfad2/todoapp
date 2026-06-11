import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumnComponent } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { ColumnForm } from './ColumnForm'
import { useKanbanStore } from '@/store/kanbanStore'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'

interface KanbanBoardProps {
  onEditTask: (task: Task) => void
}

export function KanbanBoard({ onEditTask }: KanbanBoardProps) {
  const columns = useKanbanStore((s) => s.columns)
  const addColumn = useKanbanStore((s) => s.addColumn)
  const updateColumn = useKanbanStore((s) => s.updateColumn)
  const deleteColumn = useKanbanStore((s) => s.deleteColumn)

  const tasks = useTaskStore((s) => s.tasks)
  const moveTask = useTaskStore((s) => s.moveTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const getTasksByColumn = useCallback(
    (columnId: string) =>
      tasks
        .filter((t) => t.status === columnId)
        .sort((a, b) => a.order - b.order),
    [tasks]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeItem = tasks.find((t) => t.id === activeId)
    if (!activeItem) return

    const overColumn = columns.find((col) => col.id === overId)
    const overTask = tasks.find((t) => t.id === overId)

    if (overColumn) {
      if (activeItem.status !== overColumn.id) {
        moveTask(activeId, overColumn.id, getTasksByColumn(overColumn.id).length)
      }
    } else if (overTask && activeItem.status !== overTask.status) {
      moveTask(activeId, overTask.status, overTask.order)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeItem = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (activeItem && overTask && activeItem.status === overTask.status) {
      const columnTasks = getTasksByColumn(activeItem.status)
      const overIndex = columnTasks.findIndex((t) => t.id === overId)
      moveTask(activeId, activeItem.status, overIndex)
    }
  }

  const handleUpdateColumn = (id: string, name: string) => {
    updateColumn(id, { name })
  }

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100dvh - 200px)' }}>
        {sortedColumns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onEdit={onEditTask}
            onDelete={deleteTask}
            onUpdateColumn={handleUpdateColumn}
            onDeleteColumn={deleteColumn}
          />
        ))}
        <ColumnForm onAdd={addColumn} />
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
