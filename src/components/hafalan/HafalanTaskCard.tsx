import { BookOpen, Edit, Trash2 } from 'lucide-react'
import { useHafalan } from '@/hooks/useHafalan'
import { Button } from '@/components/ui/button'
import type { HafalanTask } from '@/types'

interface HafalanTaskCardProps {
  task: HafalanTask
  onEdit: () => void
}

export function HafalanTaskCard({ task, onEdit }: HafalanTaskCardProps) {
  const { deleteTask } = useHafalan()

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0">
            <h3 className="font-medium text-foreground">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
