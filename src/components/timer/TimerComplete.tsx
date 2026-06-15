import { useEffect, useRef } from 'react'
import { CheckCircle2, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TimerCompleteProps {
  isMuted: boolean
  onToggleMute: () => void
  onDismiss: () => void
}

export function TimerComplete({
  isMuted,
  onToggleMute,
  onDismiss,
}: TimerCompleteProps) {
  const dismissRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    dismissRef.current?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="alertdialog"
      aria-label="Timer complete"
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Time&apos;s up!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Great work on your focus session. Keep going!
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="outline"
            onClick={onToggleMute}
            className="h-10 w-10"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button ref={dismissRef} onClick={onDismiss} className="px-6">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}
