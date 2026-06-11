import { Pause, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimerRunningProps {
  timeRemaining: number
  totalTime: number
  progress: number
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getProgressColor(progress: number): string {
  if (progress > 0.5) return 'stroke-primary'
  if (progress > 0.2) return 'stroke-amber-500'
  return 'stroke-red-500'
}

export function TimerRunning({
  timeRemaining,
  totalTime,
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
    <div className="flex flex-col items-center gap-3 p-4">
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
          <span className="text-2xl font-mono font-bold text-foreground">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={isPaused ? onResume : onPause}
          className="h-9 w-9"
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={onStop}
          className="h-9 w-9 text-destructive hover:text-destructive"
          aria-label="Stop timer"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
