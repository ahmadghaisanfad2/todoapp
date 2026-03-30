import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
import { TaskFilter } from '@/components/task/TaskFilter'
import { TaskList } from '@/components/task/TaskList'
import { TaskForm } from '@/components/task/TaskForm'
import { CategorySheet } from '@/components/category/CategorySheet'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/useTasks'
import { useSettingsStore } from '@/store/settingsStore'
import type { Task } from '@/types'

export function App() {
  const { activeTasks, completedTasks, searchQuery, setSearchQuery, toggleTask, deleteTask } = useTasks()
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)

  const filterStatus = useSettingsStore((s) => s.filterStatus)
  const filterPriority = useSettingsStore((s) => s.filterPriority)
  const filterCategoryId = useSettingsStore((s) => s.filterCategoryId)

  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterCategoryId !== null || searchQuery.trim().length > 0

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }

  const handleCloseTaskForm = (open: boolean) => {
    if (!open) setEditingTask(undefined)
    setTaskFormOpen(open)
  }

  return (
    <Layout>
      <Header onCategoryOpen={() => setCategorySheetOpen(true)} />
      <main className="pt-4">
        <TaskFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <TaskList
          activeTasks={activeTasks}
          completedTasks={completedTasks}
          hasActiveFilters={hasActiveFilters}
          onEdit={handleEditTask}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        onClick={() => { setEditingTask(undefined); setTaskFormOpen(true) }}
        aria-label="Add task"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <TaskForm
        open={taskFormOpen}
        onOpenChange={handleCloseTaskForm}
        task={editingTask}
      />

      <CategorySheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
      />
    </Layout>
  )
}
