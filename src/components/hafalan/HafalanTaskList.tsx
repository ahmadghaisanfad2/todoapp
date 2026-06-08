import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { useHafalan } from '@/hooks/useHafalan'
import { HafalanTaskCard } from './HafalanTaskCard'
import { HafalanTaskForm } from './HafalanTaskForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/common/EmptyState'

export function HafalanTaskList() {
  const { tasks } = useHafalan()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<{ id: string; title: string; description: string | null } | undefined>()

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (task: { id: string; title: string; description: string | null }) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleCloseForm = (open: boolean) => {
    if (!open) setEditingTask(undefined)
    setFormOpen(open)
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Cari tugas hafalan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          size="icon"
          onClick={() => {
            setEditingTask(undefined)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          message={search ? 'Tidak ditemukan' : 'Belum ada tugas hafalan'}
          description={
            search
              ? 'Coba kata kunci lain'
              : 'Tambahkan tugas hafalan seperti Juz 30, Al-Fatihah, dll'
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => (
            <HafalanTaskCard
              key={task.id}
              task={task}
              onEdit={() => handleEdit(task)}
            />
          ))}
        </div>
      )}

      <HafalanTaskForm
        key={editingTask?.id ?? 'new'}
        open={formOpen}
        onOpenChange={handleCloseForm}
        initialData={editingTask}
      />
    </div>
  )
}
