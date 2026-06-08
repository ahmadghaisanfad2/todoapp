import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useHafalan } from '@/hooks/useHafalan'
import { SetoranSheet } from './SetoranSheet'
import { AssignTaskSheet } from './AssignTaskSheet'
import { CreateTaskForSantriSheet } from './CreateTaskForSantriSheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { HafalanStatus } from '@/types'

interface SantriDetailProps {
  santri: {
    id: string
    name: string
    targetTaskIds: string[]
    createdAt: string
    progress: { total: number; completed: number; inProgress: number; notStarted: number }
  }
  onBack: () => void
}

export function SantriDetail({ santri, onBack }: SantriDetailProps) {
  const { getTasksForSantri } = useHafalan()
  const tasks = getTasksForSantri(santri.id)

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{santri.name}</h2>
            <p className="text-xs text-muted-foreground">
              {santri.progress.completed}/{santri.progress.total} selesai
            </p>
          </div>
        </div>
        <AssignTaskSheet santriId={santri.id} santriName={santri.name} />
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-4">
            Belum ada tugas hafalan untuk santri ini
          </p>
          <AssignTaskSheet santriId={santri.id} santriName={santri.name} />
          <div className="mt-3">
            <CreateTaskForSantriSheet santriId={santri.id} santriName={santri.name} />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(({ task, status, latestLog }) => (
            <div key={task.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                  )}
                </div>
                <StatusBadge status={status} />
              </div>

              {latestLog && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <LogTypeLabel type={latestLog.type} />
                    <span>•</span>
                    <time dateTime={latestLog.timestamp}>
                      {format(new Date(latestLog.timestamp), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                    </time>
                  </div>
                  {latestLog.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      "{latestLog.notes}"
                    </p>
                  )}
                </div>
              )}

              <div className="mt-3 flex justify-end">
                <SetoranSheet santriId={santri.id} taskId={task.id} taskTitle={task.title} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border/50">
        <CreateTaskForSantriSheet santriId={santri.id} santriName={santri.name} />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: HafalanStatus }) {
  const config = {
    not_started: { label: 'Belum mulai', className: 'bg-secondary text-secondary-foreground' },
    in_progress: { label: 'Sedang proses', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400' },
    completed: { label: 'Selesai', className: 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  }
  const { label, className } = config[status]
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold',
      className
    )}>
      {label}
    </span>
  )
}

function LogTypeLabel({ type }: { type: string }) {
  const config = {
    setor: { label: 'Setoran', color: 'text-green-600 dark:text-green-400' },
    murajaah: { label: 'Muraja\'ah', color: 'text-amber-600 dark:text-amber-400' },
    ziyadah: { label: 'Ziyadah', color: 'text-blue-600 dark:text-blue-400' },
  }
  const { label, color } = config[type as keyof typeof config] ?? { label: type, color: 'text-muted-foreground' }
  return <span className={`font-medium ${color}`}>{label}</span>
}
