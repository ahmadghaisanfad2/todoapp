import { useState, useEffect, useRef } from 'react'
import { Plus, ArrowLeft } from 'lucide-react'
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
  const hasShownBadge = useRef(false)

  const isSearchOpen = useMusicStore((s) => s.isSearchOpen)
  const toggleSearch = useMusicStore((s) => s.toggleSearch)
  const closeSearch = useMusicStore((s) => s.closeSearch)

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

  const handleAddTask = (columnId?: string) => {
    setEditingTask(undefined)
    setDefaultStatus(columnId)
    setTaskFormOpen(true)
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
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
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 animate-lp-fade-up">
            <Logo className="h-4 w-4 shrink-0" />
            <span className="text-[13px] font-medium text-foreground">Selamat datang.</span>
            <span className="text-[13px] text-muted-foreground">Mari bereskan yang penting hari ini.</span>
          </div>
        </div>
      )}

      <Layout>
        <Header onCategoryOpen={() => setCategorySheetOpen(true)} onAddTask={handleAddTask} onMusicOpen={toggleSearch} />
        <main className="pt-6">
          <KanbanBoard onEditTask={handleEditTask} onAddTask={handleAddTask} />
        </main>
      </Layout>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg shadow-black/10 sm:hidden"
        style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        onClick={() => handleAddTask()}
        aria-label="Tambah tugas"
      >
        <Plus className="h-5 w-5" />
      </Button>

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
      <TimerWidget />
    </div>
  )
}
