import { cn } from '@/lib/utils'
import type { Priority } from '@/types'

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-900/50' },
  medium: { label: 'Med', className: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-900/50' },
  low: { label: 'Low', className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border dark:border-emerald-900/50' },
}

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
