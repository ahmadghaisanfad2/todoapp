import { useState, useMemo } from 'react'
import { isBefore, parseISO } from 'date-fns'
import { useTaskMutations, useTaskQuery } from '@/hooks/useTaskQuery'
import type { Task } from '@/types'

export function isTaskOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) return false
  return isBefore(parseISO(task.dueDate), new Date())
}

export function useTasks() {
  const tasksQuery = useTaskQuery()
  const { deleteTask, toggleTask } = useTaskMutations()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = useMemo(() => {
    const allTasks = tasksQuery.data ?? []
    if (!searchQuery.trim()) return allTasks
    const query = searchQuery.toLowerCase()
    return allTasks.filter((t) => t.title.toLowerCase().includes(query))
  }, [tasksQuery.data, searchQuery])

  return {
    tasks: filteredTasks,
    searchQuery,
    setSearchQuery,
    deleteTask,
    toggleTask,
  }
}
