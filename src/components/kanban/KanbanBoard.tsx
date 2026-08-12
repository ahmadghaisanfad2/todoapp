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
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KanbanColumnComponent, KanbanColumnOverlay } from './KanbanColumn'
import { KanbanCardOverlay } from './KanbanCard'
import { ColumnForm } from './ColumnForm'
import { KanbanHorizontalScrollbar } from './KanbanHorizontalScrollbar'
import { EmptyState } from '@/components/common/EmptyState'
import { useHorizontalTouchScroll } from '@/hooks/useHorizontalTouchScroll'
import { useTaskMutations, useTaskQuery } from '@/hooks/useTaskQuery'
import { useKanbanStore } from '@/store/kanbanStore'
import { useWorkspaceStore } from '@/store/workspaceStore'
import type { Task, KanbanColumn } from '@/types'

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
  const reorderColumns = useKanbanStore((s) => s.reorderColumns)

  const tasksQuery = useTaskQuery()
  const { moveTask, moveTasksToColumn, deleteTask } = useTaskMutations()
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)

  const tasks = useMemo(
    () => (tasksQuery.data ?? []).filter((t) => t.workspaceId === activeWorkspaceId),
    [tasksQuery.data, activeWorkspaceId]
  )

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null)

  const setScrollNode = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node
    setScrollEl(node)
  }, [])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // Short delay + low tolerance: horizontal swipes cancel before drag starts,
    // while a still long-press still activates card drag on touch devices.
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Custom axis-locked panning — native overflow alone loses to nested pan-y / touch-action:none.
  useHorizontalTouchScroll(scrollEl, activeTask === null && activeColumn === null)

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
      // Column drags only ever land on other columns — never on cards.
      if (columnIds.has(args.active.id as string)) {
        const columnCollisions = closestCenter(args).filter(
          (c) => columnIds.has(c.id as string) && c.id !== args.active.id
        )
        return columnCollisions.length > 0 ? [columnCollisions[0]] : []
      }

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
    const id = event.active.id as string
    if (columnIds.has(id)) {
      const column = columns.find((c) => c.id === id)
      if (column) setActiveColumn(column)
      return
    }
    const task = tasks.find((t) => t.id === id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setActiveColumn(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // Column reorder path
    if (columnIds.has(activeId)) {
      const overColumn = columns.find((col) => col.id === overId)
      if (!overColumn) return
      const sorted = [...columns].sort((a, b) => a.order - b.order)
      const oldIndex = sorted.findIndex((c) => c.id === activeId)
      const newIndex = sorted.findIndex((c) => c.id === overColumn.id)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return
      const reordered = [...sorted]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)
      reorderColumns(reordered.map((c, index) => ({ ...c, order: index })))
      return
    }

    // Task move path
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
    const columnTaskIds = tasks.filter((t) => t.status === columnId).map((t) => t.id)

    // One atomic batch move (single undo entry) instead of N per-task moves.
    if (columnTaskIds.length > 0) {
      moveTasksToColumn(columnTaskIds, fallbackId)
    }

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
      onDragCancel={() => {
        setActiveTask(null)
        setActiveColumn(null)
      }}
    >
      <div data-kanban-board className="w-full min-w-0">
        <KanbanHorizontalScrollbar scrollRef={scrollRef} />
        <div
          id="kanban-board-scroll"
          ref={setScrollNode}
          className="kanban-scroll-x kanban-scroll-x-content -mx-1 flex snap-x snap-proximity items-start gap-3 overflow-x-auto overscroll-x-contain px-1 pb-4 sm:gap-4"
        >
          <SortableContext items={sortedColumns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
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
          </SortableContext>
          <ColumnForm onAdd={addColumn} />
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
        {activeColumn ? (
          <KanbanColumnOverlay
            column={activeColumn}
            taskCount={getTasksByColumn(activeColumn.id).length}
          />
        ) : activeTask ? (
          <KanbanCardOverlay
            task={activeTask}
            crossTasks={columns.find((c) => c.id === activeTask.status)?.crossTasks}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
