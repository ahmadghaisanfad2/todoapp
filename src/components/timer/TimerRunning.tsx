import { Pause, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatTime } from '@/lib/utils'

interface TimerRunningProps {
  timeRemaining: number
  progress: number
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

function getProgressColor(progress: number): string {
  if (progress > 0.5) return 'stroke-primary'
  if (progress > 0.2) return 'stroke-amber-500'
  return 'stroke-red-500'
}

export function TimerRunning({
  timeRemaining,
  progress,
  isPaused,
  onPause,
  onResume,
  onStop,
}: TimerRunningProps) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-3 p-4 sm:p-5">
      <p className="text-xs font-medium text-muted-foreground">
        {isPaused ? 'Paused' : 'Focus session'}
      </p>
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-border"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn('transition-all duration-1000', getProgressColor(progress))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={isPaused ? onResume : onPause}
          className="h-11 w-11 rounded-xl sm:h-10 sm:w-10"
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={onStop}
          className="h-11 w-11 rounded-xl text-destructive hover:text-destructive sm:h-10 sm:w-10"
          aria-label="Stop timer"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
