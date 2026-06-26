import { useState, useCallback, useMemo, useRef } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumnComponent } from './KanbanColumn'
import { KanbanCardOverlay } from './KanbanCard'
import { ColumnForm } from './ColumnForm'
import { KanbanHorizontalScrollbar } from './KanbanHorizontalScrollbar'
import { EmptyState } from '@/components/common/EmptyState'
import { useKanbanStore } from '@/store/kanbanStore'
import { useTaskStore } from '@/store/taskStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import type { Task } from '@/types'

interface KanbanBoardProps {
  onEditTask: (task: Task) => void
  onAddTask: (columnId?: string) => void
  onStartFocus?: () => void
}

export function KanbanBoard({ onEditTask, onAddTask, onStartFocus }: KanbanBoardProps) {
  const columns = useKanbanStore((s) => s.columns)
  const addColumn = useKanbanStore((s) => s.addColumn)
  const updateColumn = useKanbanStore((s) => s.updateColumn)
  const deleteColumn = useKanbanStore((s) => s.deleteColumn)

  const allTasks = useTaskStore((s) => s.tasks)
  const moveTask = useTaskStore((s) => s.moveTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)

  const tasks = useMemo(
    () => allTasks.filter((t) => t.workspaceId === activeWorkspaceId),
    [allTasks, activeWorkspaceId]
  )

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 12 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const getTasksByColumn = useCallback(
    (columnId: string) =>
      tasks
        .filter((t) => t.status === columnId)
        .sort((a, b) => a.order - b.order),
    [tasks]
  )

  const columnIds = useMemo(() => new Set(columns.map((c) => c.id)), [columns])
  const taskIds = useMemo(() => new Set(tasks.map((t) => t.id)), [tasks])

  const customCollisionDetection: CollisionDetection = useCallback(
    (args) => {
      const collisions = rectIntersection(args)
      if (collisions.length === 0) return collisions

      const taskCollision = collisions.find((c) => taskIds.has(c.id as string))
      if (taskCollision) return [taskCollision]

      const columnCollision = collisions.find((c) => columnIds.has(c.id as string))
      if (columnCollision) return [columnCollision]

      return collisions
    },
    [columnIds, taskIds]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeItem = tasks.find((t) => t.id === activeId)
    if (!activeItem) return

    const overColumn = columns.find((col) => col.id === overId)
    const overTask = tasks.find((t) => t.id === overId)

    if (overColumn) {
      if (activeItem.status !== overColumn.id) {
        moveTask(activeId, overColumn.id, getTasksByColumn(overColumn.id).length)
      }
    } else if (overTask) {
      if (activeItem.status !== overTask.status) {
        moveTask(activeId, overTask.status, overTask.order)
      } else {
        const columnTasks = getTasksByColumn(activeItem.status)
        const overIndex = columnTasks.findIndex((t) => t.id === overId)
        moveTask(activeId, activeItem.status, overIndex)
      }
    }
  }

  const handleUpdateColumn = (id: string, name: string) => {
    updateColumn(id, { name })
  }

  const handleToggleCrossTasks = (id: string) => {
    const column = columns.find((c) => c.id === id)
    if (column) {
      updateColumn(id, { crossTasks: !column.crossTasks })
    }
  }

  const handleDeleteColumn = (columnId: string) => {
    const remaining = columns.filter((col) => col.id !== columnId)
    if (remaining.length === 0) return

    const fallbackId = remaining[0].id
    tasks
      .filter((t) => t.status === columnId)
      .forEach((t) => moveTask(t.id, fallbackId, getTasksByColumn(fallbackId).length))

    deleteColumn(columnId)
  }

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
  const isBoardEmpty = tasks.length === 0

  if (isBoardEmpty) {
    return (
      <EmptyState
        message="Ready for a focus session?"
        description="Add your first task to get started, or jump straight into a timed focus block."
        primaryAction={{ label: 'Add first task', onClick: () => onAddTask() }}
        secondaryAction={
          onStartFocus
            ? { label: 'Start focus timer', onClick: onStartFocus }
            : undefined
        }
      />
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      autoScroll={{ threshold: { x: 0.12, y: 0.2 }, acceleration: 12 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div data-kanban-board className="w-full min-w-0">
        <KanbanHorizontalScrollbar scrollRef={scrollRef} />
        <div
          id="kanban-board-scroll"
          ref={scrollRef}
          className="kanban-scroll-x kanban-scroll-x-content flex items-start gap-4 overflow-x-auto pb-4"
        >
          {sortedColumns.map((column) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              activeTaskId={activeTask?.id ?? null}
              onEdit={onEditTask}
              onDelete={deleteTask}
              onAddTask={onAddTask}
              onUpdateColumn={handleUpdateColumn}
              onDeleteColumn={handleDeleteColumn}
              onToggleCrossTasks={handleToggleCrossTasks}
            />
          ))}
          <ColumnForm onAdd={addColumn} />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <KanbanCardOverlay
            task={activeTask}
            crossTasks={columns.find((c) => c.id === activeTask.status)?.crossTasks}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
