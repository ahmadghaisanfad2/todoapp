import { useState, useRef, useEffect } from 'react'
import { Timer } from 'lucide-react'
import { useTimer } from '@/hooks/useTimer'
import { TimerSetup } from './TimerSetup'
import { TimerRunning } from './TimerRunning'
import { TimerComplete } from './TimerComplete'
import { useMusicStore } from '@/store/musicStore'
import { cn } from '@/lib/utils'
import { getMobileFabBottomStyle, getMobileFabRightStyle } from '@/lib/fabPosition'

interface TimerWidgetProps {
  openRequest?: number
}

export function TimerWidget({ openRequest = 0 }: TimerWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showHint, setShowHint] = useState(() => {
    try { return !localStorage.getItem('wazheefa-timer-hint-seen') }
    catch { return true }
  })
  const timer = useTimer()
  const widgetRef = useRef<HTMLDivElement>(null)
  const hasMusicBar = useMusicStore((s) => s.currentTrack !== null)
  const fabPosition = { ...getMobileFabBottomStyle(hasMusicBar), ...getMobileFabRightStyle() }

  useEffect(() => {
    if (!isExpanded) return
    const handleClickOutside = (e: PointerEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [isExpanded])

  useEffect(() => {
    if (!showHint) return
    const t = setTimeout(() => {
      setShowHint(false)
      try { localStorage.setItem('wazheefa-timer-hint-seen', 'true') } catch { /* ignore */ }
    }, 5000)
    return () => clearTimeout(t)
  }, [showHint])

  useEffect(() => {
    if (openRequest === 0) return
    queueMicrotask(() => {
      setIsExpanded(true)
      setShowHint(false)
      try { localStorage.setItem('wazheefa-timer-hint-seen', 'true') } catch { /* ignore */ }
    })
  }, [openRequest])

  if (timer.state === 'complete') {
    return (
      <div aria-live="assertive" className="animate-card-in">
        <TimerComplete
          isMuted={timer.isMuted}
          onToggleMute={timer.toggleMute}
          onDismiss={timer.dismiss}
        />
      </div>
    )
  }

  if (timer.state === 'running' || timer.state === 'paused') {
    return (
      <div ref={widgetRef} className="fixed z-[60] animate-card-in" style={fabPosition}>
        <div className="rounded-2xl border border-border bg-card shadow-2xl">
          <TimerRunning
            timeRemaining={timer.timeRemaining}
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
    <div ref={widgetRef} className="fixed z-[60]" style={fabPosition}>
      {isExpanded ? (
        <div className="rounded-2xl border border-border bg-card shadow-2xl animate-card-in">
          <TimerSetup onStart={(seconds) => {
            timer.start(seconds)
            setIsExpanded(false)
          }} />
        </div>
      ) : (
        <div className="relative">
          {showHint && (
            <div className="absolute bottom-full right-0 mb-3 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium shadow-lg whitespace-nowrap animate-hero-fade-1">
              Start a focus session here
              <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground" />
            </div>
          )}
          <button
            onClick={() => {
              setIsExpanded(true)
              if (showHint) {
                setShowHint(false)
                try { localStorage.setItem('wazheefa-timer-hint-seen', 'true') } catch { /* ignore */ }
              }
            }}
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
        </div>
      )}
    </div>
  )
}
