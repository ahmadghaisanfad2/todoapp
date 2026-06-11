import { useState } from 'react'
import { Timer } from 'lucide-react'
import { useTimer } from '@/hooks/useTimer'
import { TimerSetup } from './TimerSetup'
import { TimerRunning } from './TimerRunning'
import { TimerComplete } from './TimerComplete'
import { cn } from '@/lib/utils'

export function TimerWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const timer = useTimer()

  if (timer.state === 'complete') {
    return (
      <TimerComplete
        isMuted={timer.isMuted}
        onToggleMute={timer.toggleMute}
        onDismiss={timer.dismiss}
      />
    )
  }

  if (timer.state === 'running' || timer.state === 'paused') {
    return (
      <div className="fixed bottom-6 right-6 z-40 sm:bottom-6 sm:right-6"
           style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}>
        <div className="rounded-2xl border border-border bg-card shadow-2xl">
          <TimerRunning
            timeRemaining={timer.timeRemaining}
            totalTime={timer.totalTime}
            progress={timer.progress}
            isPaused={timer.state === 'paused'}
            onPause={timer.pause}
            onResume={timer.resume}
            onStop={timer.stop}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-6 sm:right-6"
         style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}>
      {isExpanded ? (
        <div className="rounded-2xl border border-border bg-card shadow-2xl">
          <TimerSetup onStart={(seconds) => {
            timer.start(seconds)
            setIsExpanded(false)
          }} />
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'bg-primary text-primary-foreground shadow-lg shadow-primary/20',
            'transition-all duration-200 hover:scale-105 hover:shadow-xl',
            'active:scale-95'
          )}
          aria-label="Open focus timer"
        >
          <Timer className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
