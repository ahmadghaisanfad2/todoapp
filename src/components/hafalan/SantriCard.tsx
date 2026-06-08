import { CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import type { Santri } from '@/types'

interface SantriCardProps {
  santri: Santri & { progress: { total: number; completed: number; inProgress: number; notStarted: number } }
  onClick: () => void
}

export function SantriCard({ santri, onClick }: SantriCardProps) {
  const { progress } = santri
  const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{santri.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {progress.completed}/{progress.total} selesai
          </p>
        </div>
        <div className="relative h-12 w-12 shrink-0">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke={pct === 100 ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
            {pct}%
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-3 text-[11px]">
        <span className="flex items-center gap-1 text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          {progress.completed}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <PlayCircle className="h-3 w-3 text-amber-500" />
          {progress.inProgress}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Circle className="h-3 w-3 text-muted-foreground/50" />
          {progress.notStarted}
        </span>
      </div>
    </button>
  )
}
