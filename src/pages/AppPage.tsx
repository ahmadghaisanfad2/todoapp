import { useState, useEffect, useRef } from 'react'
import { Plus, ArrowLeft, ClipboardList, BookOpen } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
import { TaskFilter } from '@/components/task/TaskFilter'
import { TaskList } from '@/components/task/TaskList'
import { TaskForm } from '@/components/task/TaskForm'
import { CategorySheet } from '@/components/category/CategorySheet'
import { HafalanTab } from '@/components/hafalan/HafalanTab'
import { MusicPlayerBar } from '@/components/music/MusicPlayerBar'
import { MusicSearchSheet } from '@/components/music/MusicSearchSheet'
import { TimerWidget } from '@/components/timer/TimerWidget'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/useTasks'
import { useSettingsStore } from '@/store/settingsStore'
import { useMusicStore } from '@/store/musicStore'
import type { Task } from '@/types'

type AppTab = 'tasks' | 'hafalan'

interface AppPageProps {
  onNavigateHome: () => void
}

export function AppPage({ onNavigateHome }: AppPageProps) {
  const { activeTasks, completedTasks, searchQuery, setSearchQuery, toggleTask, deleteTask } = useTasks()
  const [activeTab, setActiveTab] = useState<AppTab>('tasks')
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)
  const [showWelcomeBadge, setShowWelcomeBadge] = useState(false)
  const hasShownBadge = useRef(false)

  const filterStatus = useSettingsStore((s) => s.filterStatus)
  const filterPriority = useSettingsStore((s) => s.filterPriority)
  const filterCategoryId = useSettingsStore((s) => s.filterCategoryId)

  const isSearchOpen = useMusicStore((s) => s.isSearchOpen)
  const toggleSearch = useMusicStore((s) => s.toggleSearch)
  const closeSearch = useMusicStore((s) => s.closeSearch)

  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterCategoryId !== null || searchQuery.trim().length > 0

  useEffect(() => {
    if (hasShownBadge.current) return
    hasShownBadge.current = true
    queueMicrotask(() => {
      setShowWelcomeBadge(true)
      setTimeout(() => {
        setShowWelcomeBadge(false)
      }, 1200)
    })
  }, [])

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }

  const handleCloseTaskForm = (open: boolean) => {
    if (!open) setEditingTask(undefined)
    setTaskFormOpen(open)
  }

  const handleAddTask = () => {
    setEditingTask(undefined)
    setTaskFormOpen(true)
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </button>
        <span className="text-sm font-semibold text-foreground">Wazheefa</span>
      </div>

      {showWelcomeBadge && (
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 animate-lp-fade-up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-[13px] font-medium text-foreground">Selamat datang.</span>
            <span className="text-[13px] text-muted-foreground">Mari bereskan yang penting hari ini.</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 pt-2">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => {
              setActiveTab('tasks')
              setTaskFormOpen(false)
              setCategorySheetOpen(false)
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Tugas
          </button>
          <button
            onClick={() => {
              setActiveTab('hafalan')
              setTaskFormOpen(false)
              setCategorySheetOpen(false)
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'hafalan'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Hafalan
          </button>
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <Layout>
          <Header onCategoryOpen={() => setCategorySheetOpen(true)} onAddTask={handleAddTask} onMusicOpen={toggleSearch} />
          <main className="pt-6">
            <TaskFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div className="mt-4">
              <TaskList
                activeTasks={activeTasks}
                completedTasks={completedTasks}
                hasActiveFilters={hasActiveFilters}
                onEdit={handleEditTask}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </div>
          </main>
        </Layout>
      ) : (
        <div className="mx-auto max-w-5xl px-4 py-6">
          <HafalanTab />
        </div>
      )}

      {activeTab === 'tasks' && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg shadow-black/10 sm:hidden"
          style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
          onClick={handleAddTask}
          aria-label="Tambah tugas"
        >
          <Plus className="h-5 w-5" />
        </Button>
      )}

      <TaskForm
        key={editingTask?.id ?? 'new'}
        open={taskFormOpen}
        onOpenChange={handleCloseTaskForm}
        task={editingTask}
      />

      <CategorySheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
      />

      <MusicPlayerBar onOpenSearch={toggleSearch} />
      <MusicSearchSheet open={isSearchOpen} onOpenChange={closeSearch} />
      <TimerWidget />
    </div>
  )
}
