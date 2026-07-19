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
    <div className="flex flex-col items-center justify-center px-2 py-16 text-center sm:py-20">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 sm:mb-6 sm:h-16 sm:w-16">
        <Icon className="h-7 w-7 text-primary/70 sm:h-8 sm:w-8" />
      </div>
      <p className="font-brand text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {message}
      </p>
      <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted-foreground sm:max-w-[36ch]">
        {description}
      </p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-7 flex w-full max-w-xs flex-col items-stretch gap-2 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="h-11 rounded-xl shadow-sm shadow-primary/15 sm:h-10"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="h-11 rounded-xl sm:h-10"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { SearchX }
