import { ClipboardList } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  description?: string
}

export function EmptyState({
  message = 'No tasks yet',
  description = 'Add your first task using the + button below',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/40" />
      <p className="text-base font-medium text-muted-foreground">{message}</p>
      <p className="mt-1 text-sm text-muted-foreground/60">{description}</p>
    </div>
  )
}
