import { useEffect, useState } from 'react'
import type { AnimationEvent } from 'react'
import { X } from 'lucide-react'
import { useUndoStore } from '@/store/undoStore'
import { cn } from '@/lib/utils'

interface ToastDisplay {
  key: string
  mode: 'undo' | 'confirmation'
  description: string
}

export function UndoToast() {
  const stack = useUndoStore((s) => s.stack)
  const lastUndone = useUndoStore((s) => s.lastUndone)
  const toastHidden = useUndoStore((s) => s.toastHidden)
  const popUndo = useUndoStore((s) => s.popUndo)
  const hideToast = useUndoStore((s) => s.hideToast)

  const contentKey = lastUndone ?? stack[0]?.id ?? null
  const shouldShow = !toastHidden && contentKey !== null
  const topStackItem = stack[0]

  const [display, setDisplay] = useState<ToastDisplay | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (!shouldShow) return

    queueMicrotask(() => {
      setIsExiting(false)
      if (lastUndone !== null) {
        setDisplay({ key: `done-${lastUndone}`, mode: 'confirmation', description: lastUndone })
        return
      }
      if (topStackItem) {
        setDisplay({
          key: topStackItem.id,
          mode: 'undo',
          description: topStackItem.description,
        })
      }
    })
  }, [shouldShow, lastUndone, topStackItem])

  useEffect(() => {
    if (shouldShow || !display) return
    queueMicrotask(() => setIsExiting(true))
  }, [shouldShow, display])

  function handleAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
    if (e.animationName !== 'toast-out') return
    setIsExiting(false)
    setDisplay(null)
  }

  const showToast = (shouldShow && display !== null) || (isExiting && display !== null)
  if (!showToast || !display) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        key={display.key}
        onAnimationEnd={handleAnimationEnd}
        className={cn(
          'pointer-events-auto group relative flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg',
          isExiting ? 'animate-toast-out' : 'animate-toast-in'
        )}
      >
        <button
          onClick={hideToast}
          aria-label="Dismiss"
          className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
        {display.mode === 'confirmation' ? (
          <span className="text-sm text-muted-foreground">
            Undone: {display.description}
          </span>
        ) : (
          <>
            <span className="text-sm text-foreground">
              {display.description}
            </span>
            <button
              onClick={popUndo}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Undo
            </button>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              ⌘Z
            </span>
          </>
        )}
      </div>
    </div>
  )
}
