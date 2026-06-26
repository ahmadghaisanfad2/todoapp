import { ClipboardList, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateAction {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  message?: string
  description?: string
  icon?: LucideIcon
  primaryAction?: EmptyStateAction
  secondaryAction?: EmptyStateAction
}

export function EmptyState({
  message = 'No tasks yet',
  description = 'Add your first task using the New task button above',
  icon: Icon = ClipboardList,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Icon className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <p className="text-base font-medium text-foreground">{message}</p>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-[320px]">{description}</p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {primaryAction && (
            <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { SearchX }
