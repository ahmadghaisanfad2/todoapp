import { useState, useMemo } from 'react'
import { isBefore, parseISO } from 'date-fns'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'

export function isTaskOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) return false
  return isBefore(parseISO(task.dueDate), new Date())
}

export function useTasks() {
  const tasks = useTaskStore((s) => s.tasks)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const toggleTask = useTaskStore((s) => s.toggleTask)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks
    const query = searchQuery.toLowerCase()
    return tasks.filter((t) => t.title.toLowerCase().includes(query))
  }, [tasks, searchQuery])

  return {
    tasks: filteredTasks,
    searchQuery,
    setSearchQuery,
    deleteTask,
    toggleTask,
  }
}
