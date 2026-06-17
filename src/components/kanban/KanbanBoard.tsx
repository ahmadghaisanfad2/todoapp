import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
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
import { KanbanCard } from './KanbanCard'
import { ColumnForm } from './ColumnForm'
import { useKanbanStore } from '@/store/kanbanStore'
import { useTaskStore } from '@/store/taskStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import type { Task } from '@/types'

interface KanbanBoardProps {
  onEditTask: (task: Task) => void
  onAddTask: (columnId?: string) => void
}

export function KanbanBoard({ onEditTask, onAddTask }: KanbanBoardProps) {
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
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const isSyncing = useRef(false)

  useEffect(() => {
    const scroll = scrollRef.current
    const scrollbar = scrollbarRef.current
    if (!scroll || !scrollbar) return

    const syncFromContent = () => {
      if (isSyncing.current) return
      isSyncing.current = true
      scrollbar.scrollLeft = scroll.scrollLeft
      isSyncing.current = false
    }

    const syncFromScrollbar = () => {
      if (isSyncing.current) return
      isSyncing.current = true
      scroll.scrollLeft = scrollbar.scrollLeft
      isSyncing.current = false
    }

    scroll.addEventListener('scroll', syncFromContent, { passive: true })
    scrollbar.addEventListener('scroll', syncFromScrollbar, { passive: true })
    return () => {
      scroll.removeEventListener('scroll', syncFromContent)
      scrollbar.removeEventListener('scroll', syncFromScrollbar)
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
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

  const customCollisionDetection: CollisionDetection = useCallback(
    (args) => {
      const pointerCollisions = rectIntersection(args)
      if (pointerCollisions.length > 0) {
        const columnCollision = pointerCollisions.find((c) => columnIds.has(c.id as string))
        if (columnCollision) return [columnCollision]
      }
      return pointerCollisions
    },
    [columnIds]
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={scrollbarRef}
        className="flex gap-4 overflow-x-auto scrollbar-thin"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div style={{ minWidth: sortedColumns.length * 288 + 280, height: 0 }} />
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100dvh - 200px)' }}>
        {sortedColumns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
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

      <DragOverlay>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            onEdit={() => {}}
            onDelete={() => {}}
            crossTasks={columns.find((c) => c.id === activeTask.status)?.crossTasks}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
