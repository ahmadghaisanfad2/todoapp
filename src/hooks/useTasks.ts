import { useState, useMemo } from 'react'
import { isBefore, parseISO, startOfDay } from 'date-fns'
import { useTaskStore } from '@/store/taskStore'
import { useSettingsStore } from '@/store/settingsStore'
import type { Task } from '@/types'

export function isTaskOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) return false
  return isBefore(parseISO(task.dueDate), startOfDay(new Date()))
}

const priorityOrder: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 }

export function useTasks() {
  const tasks = useTaskStore((s) => s.tasks)
  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const toggleTask = useTaskStore((s) => s.toggleTask)

  const sortBy = useSettingsStore((s) => s.sortBy)
  const filterStatus = useSettingsStore((s) => s.filterStatus)
  const filterCategoryId = useSettingsStore((s) => s.filterCategoryId)
  const filterPriority = useSettingsStore((s) => s.filterPriority)

  const [searchQuery, setSearchQuery] = useState('')

  const filteredSortedTasks = useMemo(() => {
    let result = tasks

    if (filterStatus === 'active') result = result.filter((t) => !t.completed)
    else if (filterStatus === 'completed') result = result.filter((t) => t.completed)

    if (filterCategoryId !== null) result = result.filter((t) => t.categoryId === filterCategoryId)

    if (filterPriority !== 'all') result = result.filter((t) => t.priority === filterPriority)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((t) => t.title.toLowerCase().includes(q))
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (sortBy === 'priority') {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return b.createdAt.localeCompare(a.createdAt)
    })

    return result
  }, [tasks, filterStatus, filterCategoryId, filterPriority, searchQuery, sortBy])

  const activeTasks = useMemo(() => filteredSortedTasks.filter((t) => !t.completed), [filteredSortedTasks])
  const completedTasks = useMemo(() => filteredSortedTasks.filter((t) => t.completed), [filteredSortedTasks])

  return {
    filteredTasks: filteredSortedTasks,
    activeTasks,
    completedTasks,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  }
}
