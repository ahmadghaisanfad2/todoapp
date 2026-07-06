import { Cloud, CloudOff, Loader2 } from 'lucide-react'
import { useSyncStatusStore } from '@/store/syncStatusStore'
import { cn } from '@/lib/utils'

export function SyncStatus() {
  const status = useSyncStatusStore((s) => s.status)
  const error = useSyncStatusStore((s) => s.error)

  if (status === 'idle') return null

  const label =
    status === 'syncing'
      ? 'Syncing…'
      : status === 'synced'
        ? 'Synced'
        : status === 'offline'
          ? 'Offline'
          : 'Sync error'

  const Icon =
    status === 'syncing' ? Loader2 : status === 'offline' ? CloudOff : Cloud

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs text-muted-foreground',
        status === 'syncing' && '[&_svg]:animate-spin',
        status === 'error' && 'text-destructive'
      )}
      title={error ?? label}
      aria-label={error ?? label}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </span>
  )
}
