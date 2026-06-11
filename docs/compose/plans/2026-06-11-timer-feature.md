# Timer Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a focus timer widget that lets users challenge themselves to complete tasks within a set time, with preset durations, visual countdown, and alarm notification.

**Architecture:** A self-contained floating widget component with its own state management via a custom hook. Uses Web Audio API for chime sound generation (no external files). Browser Notification API for alerts. The widget is rendered once in AppPage and manages its own lifecycle.

**Tech Stack:** React 19, Zustand (not needed - local state), Tailwind CSS v4, Web Audio API, Notification API, lucide-react icons

---

## File Structure

| File | Purpose |
|------|---------|
| `src/hooks/useTimer.ts` | Timer logic: countdown, pause, resume, sound generation |
| `src/components/timer/TimerWidget.tsx` | Main floating widget container |
| `src/components/timer/TimerSetup.tsx` | Preset buttons + custom time input |
| `src/components/timer/TimerRunning.tsx` | SVG progress ring + countdown display |
| `src/components/timer/TimerComplete.tsx` | Completion overlay with sound controls |
| `src/pages/AppPage.tsx` | Add `<TimerWidget />` render |

---

### Task 1: Create useTimer hook

**Covers:** Timer logic, sound generation, notification

**Files:**
- Create: `src/hooks/useTimer.ts`

- [ ] **Step 1: Create the hook with all timer logic**

```typescript
import { useState, useEffect, useRef, useCallback } from 'react'

type TimerState = 'idle' | 'running' | 'paused' | 'complete'

interface UseTimerReturn {
  state: TimerState
  timeRemaining: number
  totalTime: number
  progress: number
  start: (seconds: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  dismiss: () => void
  isMuted: boolean
  toggleMute: () => void
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>('idle')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const chimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const progress = totalTime > 0 ? timeRemaining / totalTime : 0

  const playChime = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      const ctx = audioContextRef.current
      const now = ctx.currentTime

      const tones = [523.25, 659.25, 783.99] // C5, E5, G5
      tones.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.3, now + i * 0.3)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.8)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.3)
        osc.stop(now + i * 0.3 + 0.8)
      })
    } catch {
      // Audio not available
    }
  }, [])

  const startChimeInterval = useCallback(() => {
    if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current)
    chimeIntervalRef.current = setInterval(() => {
      playChime()
    }, 3000)
  }, [playChime])

  const stopChimeInterval = useCallback(() => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current)
      chimeIntervalRef.current = null
    }
  }, [])

  const showNotification = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Wazheefa', {
        body: "Time's up! Great work on your focus session.",
        icon: '/favicon.svg',
      })
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (state === 'running' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setState('complete')
            playChime()
            startChimeInterval()
            showNotification()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state, timeRemaining, playChime, startChimeInterval, showNotification])

  const start = useCallback((seconds: number) => {
    requestNotificationPermission()
    setTotalTime(seconds)
    setTimeRemaining(seconds)
    setState('running')
  }, [requestNotificationPermission])

  const pause = useCallback(() => {
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    setState('running')
  }, [])

  const stop = useCallback(() => {
    setState('idle')
    setTimeRemaining(0)
    setTotalTime(0)
    stopChimeInterval()
  }, [stopChimeInterval])

  const dismiss = useCallback(() => {
    setState('idle')
    setTimeRemaining(0)
    setTotalTime(0)
    stopChimeInterval()
  }, [stopChimeInterval])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  return {
    state,
    timeRemaining,
    totalTime,
    progress,
    start,
    pause,
    resume,
    stop,
    dismiss,
    isMuted,
    toggleMute,
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTimer.ts
git commit -m "feat(timer): add useTimer hook with countdown, chime sound, and notifications"
```

---

### Task 2: Create TimerSetup component

**Covers:** Preset buttons, custom time input

**Files:**
- Create: `src/components/timer/TimerSetup.tsx`

- [ ] **Step 1: Create the setup component**

```typescript
import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TimerSetupProps {
  onStart: (seconds: number) => void
}

const PRESETS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
]

export function TimerSetup({ onStart }: TimerSetupProps) {
  const [customMinutes, setCustomMinutes] = useState('')

  const handleCustomStart = () => {
    const mins = parseInt(customMinutes, 10)
    if (mins > 0 && mins <= 120) {
      onStart(mins * 60)
      setCustomMinutes('')
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Pick a duration
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            onClick={() => onStart(preset.seconds)}
            className={cn(
              'rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium',
              'transition-all duration-150 hover:border-primary hover:bg-primary/5 hover:text-primary',
              'active:scale-95'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={120}
          placeholder="Custom (min)"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomStart()}
          className="h-9 text-sm"
        />
        <Button
          size="sm"
          onClick={handleCustomStart}
          disabled={!customMinutes || parseInt(customMinutes, 10) <= 0}
          className="h-9 px-3"
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/timer/TimerSetup.tsx
git commit -m "feat(timer): add TimerSetup component with presets and custom input"
```

---

### Task 3: Create TimerRunning component

**Covers:** Progress ring, countdown display, pause/stop controls

**Files:**
- Create: `src/components/timer/TimerRunning.tsx`

- [ ] **Step 1: Create the running timer component**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/timer/TimerRunning.tsx
git commit -m "feat(timer): add TimerRunning component with SVG progress ring"
```

---

### Task 4: Create TimerComplete component

**Covers:** Completion overlay, sound controls

**Files:**
- Create: `src/components/timer/TimerComplete.tsx`

- [ ] **Step 1: Create the completion overlay component**

```typescript
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Time's up!</h2>
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
          <Button onClick={onDismiss} className="px-6">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/timer/TimerComplete.tsx
git commit -m "feat(timer): add TimerComplete overlay with sound controls"
```

---

### Task 5: Create TimerWidget container

**Covers:** Widget state management, floating UI, state transitions

**Files:**
- Create: `src/components/timer/TimerWidget.tsx`

- [ ] **Step 1: Create the main widget component**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/timer/TimerWidget.tsx
git commit -m "feat(timer): add TimerWidget container with state-driven UI"
```

---

### Task 6: Integrate TimerWidget into AppPage

**Covers:** App integration

**Files:**
- Modify: `src/pages/AppPage.tsx`

- [ ] **Step 1: Add TimerWidget import and render**

Add import at top of file (after existing imports):

```typescript
import { TimerWidget } from '@/components/timer/TimerWidget'
```

Add render before closing `</div>` in the return statement:

```typescript
      <TimerWidget />
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/AppPage.tsx
git commit -m "feat(timer): integrate TimerWidget into AppPage"
```

---

### Task 7: Visual verification

**Covers:** UI/UX verification

**Files:** None (verification only)

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Take screenshot of timer button**

Use agent-browser to navigate to http://localhost:5173/app and screenshot the floating timer button.

- [ ] **Step 3: Click timer button and screenshot setup panel**

Click the timer button, screenshot the preset buttons and custom input.

- [ ] **Step 4: Click a preset and screenshot running state**

Click "5 min" preset, screenshot the progress ring and countdown.

- [ ] **Step 5: Verify pause/resume works**

Click pause, verify icon changes to play. Click resume, verify countdown continues.

- [ ] **Step 6: Verify stop works**

Click stop, verify widget returns to idle state.

- [ ] **Step 7: Run full type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 8: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 9: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(timer): visual polish and final adjustments"
```
