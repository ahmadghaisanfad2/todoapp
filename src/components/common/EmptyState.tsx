import { ClipboardList, SearchX } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  description?: string
  icon?: LucideIcon
}

export function EmptyState({
  message = 'No tasks yet',
  description = 'Add your first task using the New task button above',
  icon: Icon = ClipboardList,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Icon className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <p className="text-base font-medium text-foreground">{message}</p>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-[260px]">{description}</p>
    </div>
  )
}

export { SearchX }
