import type { Task } from '@/types'

/**
 * Pure task-ordering helpers used by the task store.
 *
 * All functions return the SAME array reference when nothing changed, so
 * callers can cheaply detect no-ops (e.g. avoid pushing undo entries).
 * Tasks whose order or status is unaffected keep their object identity,
 * which avoids needless re-renders in the kanban board.
 */

/**
 * Reorders a task within its own column. Returns the input array unchanged
 * (same reference) when the task is not found or already at the target index.
 */
export function reorderWithinColumn(
  tasks: Task[],
  taskId: string,
  targetIndex: number,
  now: string
): Task[] {
  const task = tasks.find((t) => t.id === taskId)
  if (!task) return tasks

  const columnTasks = tasks
    .filter((t) => t.status === task.status)
    .sort((a, b) => a.order - b.order)
  const fromIndex = columnTasks.findIndex((t) => t.id === taskId)
  if (fromIndex === -1 || fromIndex === targetIndex) return tasks

  const reordered = [...columnTasks]
  const [removed] = reordered.splice(fromIndex, 1)
  reordered.splice(targetIndex, 0, removed)

  const orderById = new Map(reordered.map((t, index) => [t.id, index]))

  return tasks.map((t) => {
    const newOrder = orderById.get(t.id)
    if (newOrder === undefined) return t
    if (t.id !== taskId && t.order === newOrder) return t
    return {
      ...t,
      order: newOrder,
      completed: t.id === taskId ? t.status === 'done' : t.completed,
      updatedAt: now,
    }
  })
}

/**
 * Moves a task into another column at the given index (clamped to bounds),
 * compacting the source column's orders. Returns the input array unchanged
 * when the task is not found or already in the destination column.
 */
export function moveBetweenColumns(
  tasks: Task[],
  taskId: string,
  destStatus: string,
  targetIndex: number,
  now: string
): Task[] {
  const task = tasks.find((t) => t.id === taskId)
  if (!task || task.status === destStatus) return tasks

  const sourceStatus = task.status
  const sourceTasks = tasks
    .filter((t) => t.status === sourceStatus && t.id !== taskId)
    .sort((a, b) => a.order - b.order)
  const destTasks = tasks
    .filter((t) => t.status === destStatus && t.id !== taskId)
    .sort((a, b) => a.order - b.order)

  const clampedIndex = Math.min(Math.max(0, targetIndex), destTasks.length)
  destTasks.splice(clampedIndex, 0, { ...task, status: destStatus })

  const sourceOrderById = new Map(sourceTasks.map((t, index) => [t.id, index]))
  const destOrderById = new Map(destTasks.map((t, index) => [t.id, index]))

  return tasks.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        status: destStatus,
        order: clampedIndex,
        completed: destStatus === 'done',
        updatedAt: now,
      }
    }
    if (t.status === sourceStatus) {
      const newOrder = sourceOrderById.get(t.id)
      if (newOrder === undefined) return t
      if (t.order === newOrder) return t
      return { ...t, order: newOrder, updatedAt: now }
    }
    if (t.status === destStatus) {
      const newOrder = destOrderById.get(t.id)
      if (newOrder === undefined) return t
      if (t.order === newOrder) return t
      return { ...t, order: newOrder, updatedAt: now }
    }
    return t
  })
}

/**
 * Moves several tasks into a column in one shot. Moved tasks keep their
 * relative order and are appended after the destination column's existing
 * tasks; source columns are compacted. One atomic state change — callers
 * push a single undo entry.
 */
export function moveTasksToColumn(
  tasks: Task[],
  taskIds: string[],
  destStatus: string,
  now: string
): Task[] {
  const movedSet = new Set(taskIds)
  const moved = tasks.filter((t) => movedSet.has(t.id))
  if (moved.length === 0) return tasks

  const remaining = tasks.filter((t) => !movedSet.has(t.id))
  const movedSorted = [...moved].sort((a, b) => a.order - b.order)

  // Only columns that lost or gained tasks need new orders.
  const touched = new Set<string>([destStatus, ...moved.map((t) => t.status)])
  const orderById = new Map<string, number>()
  for (const status of touched) {
    remaining
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order)
      .forEach((t, index) => orderById.set(t.id, index))
  }

  const destCount = remaining.filter((t) => t.status === destStatus).length
  movedSorted.forEach((t, index) => orderById.set(t.id, destCount + index))

  return tasks.map((t) => {
    const newOrder = orderById.get(t.id)
    if (newOrder === undefined) return t
    if (!movedSet.has(t.id) && t.order === newOrder) return t
    if (movedSet.has(t.id)) {
      return {
        ...t,
        status: destStatus,
        order: newOrder,
        completed: destStatus === 'done',
        updatedAt: now,
      }
    }
    return { ...t, order: newOrder, updatedAt: now }
  })
}
