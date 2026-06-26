import { useEffect, useState, useMemo, useRef } from 'react'
import { Plus } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { TaskForm } from '@/components/task/TaskForm'
import { CategorySheet } from '@/components/category/CategorySheet'
import { MusicPlayerBar } from '@/components/music/MusicPlayerBar'
import { MusicSearchSheet } from '@/components/music/MusicSearchSheet'
import { TimerWidget } from '@/components/timer/TimerWidget'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { useMusicStore } from '@/store/musicStore'
import { ensureDefaultWorkspace, useWorkspaceStore } from '@/store/workspaceStore'
import { useTaskStore } from '@/store/taskStore'
import { getMobileFabBottomStyle, getMobileFabLeftStyle } from '@/lib/fabPosition'
import type { Task } from '@/types'

interface AppPageProps {
  onNavigateHome: () => void
}

export function AppPage({ onNavigateHome }: AppPageProps) {
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [defaultStatus, setDefaultStatus] = useState<string | undefined>()
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)
  const [showWelcomeBadge, setShowWelcomeBadge] = useState(false)
  const [focusTimerRequest, setFocusTimerRequest] = useState(0)
  const hasShownBadge = useRef(false)

  const isSearchOpen = useMusicStore((s) => s.isSearchOpen)
  const toggleSearch = useMusicStore((s) => s.toggleSearch)
  const closeSearch = useMusicStore((s) => s.closeSearch)
  const hasMusicBar = useMusicStore((s) => s.currentTrack !== null)
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)
  const allTasks = useTaskStore((s) => s.tasks)
  const hasTasks = useMemo(
    () => allTasks.some((t) => t.workspaceId === activeWorkspaceId),
    [allTasks, activeWorkspaceId]
  )

  useEffect(() => {
    ensureDefaultWorkspace()
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

  const handleAddTask = (columnId?: string) => {
    setEditingTask(undefined)
    setDefaultStatus(columnId)
    setTaskFormOpen(true)
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <Header
        onNavigateHome={onNavigateHome}
        onCategoryOpen={() => setCategorySheetOpen(true)}
        onAddTask={handleAddTask}
        onMusicOpen={toggleSearch}
      />

      {showWelcomeBadge && (
        <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
            <Logo className="h-4 w-4 shrink-0" />
            <span className="text-[13px] font-medium text-foreground">Welcome.</span>
            <span className="text-[13px] text-muted-foreground">Let&apos;s tackle what matters today.</span>
          </div>
        </div>
      )}

      <Layout>
        <main className="pt-6">
          <h1 className="sr-only">Tasks</h1>
          <KanbanBoard
            onEditTask={handleEditTask}
            onAddTask={handleAddTask}
            onStartFocus={() => setFocusTimerRequest((n) => n + 1)}
          />
        </main>
      </Layout>

      {hasTasks && (
        <Button
          size="icon"
          className="fixed z-[60] h-12 w-12 rounded-full shadow-lg shadow-black/10 sm:hidden"
          style={{ ...getMobileFabBottomStyle(hasMusicBar), ...getMobileFabLeftStyle() }}
          onClick={() => handleAddTask()}
          aria-label="Add task"
        >
          <Plus className="h-5 w-5" />
        </Button>
      )}

      <TaskForm
        key={editingTask?.id ?? 'new'}
        open={taskFormOpen}
        onOpenChange={handleCloseTaskForm}
        task={editingTask}
        defaultStatus={defaultStatus}
      />

      <CategorySheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
      />

      <MusicPlayerBar onOpenSearch={toggleSearch} />
      <MusicSearchSheet open={isSearchOpen} onOpenChange={closeSearch} />
      <TimerWidget openRequest={focusTimerRequest} />
    </div>
  )
}
