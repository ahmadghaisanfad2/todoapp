import { useEffect, type RefObject } from 'react'

interface TouchScrollRelay {
  startX: number
  startY: number
  startScrollLeft: number
  locked: 'horizontal' | 'vertical' | null
}

interface UseTouchHorizontalScrollOptions {
  enabled?: boolean
  isDraggingRef?: RefObject<boolean>
}

export function useTouchHorizontalScroll(
  surfaceRef: RefObject<HTMLElement | null>,
  scrollElementId: string | null,
  { enabled = true, isDraggingRef }: UseTouchHorizontalScrollOptions = {}
) {
  useEffect(() => {
    if (!enabled || !scrollElementId) return

    let relay: TouchScrollRelay | null = null
    let frameId = 0
    let cleanup: (() => void) | undefined

    const attach = () => {
      const surface = surfaceRef.current
      const scrollElement = document.getElementById(scrollElementId)
      if (!surface || !scrollElement) return false

      const isInteractiveTarget = (target: EventTarget | null) =>
        target instanceof Element &&
        Boolean(target.closest('button, input, textarea, select, [role="dialog"], [data-kanban-scrollbar-track]'))

      const onTouchStart = (event: TouchEvent) => {
        if (isDraggingRef?.current || event.touches.length !== 1 || isInteractiveTarget(event.target)) return
        relay = {
          startX: event.touches[0].clientX,
          startY: event.touches[0].clientY,
          startScrollLeft: scrollElement.scrollLeft,
          locked: null,
        }
      }

      const onTouchMove = (event: TouchEvent) => {
        if (!relay || isDraggingRef?.current || event.touches.length !== 1) return

        const dx = event.touches[0].clientX - relay.startX
        const dy = event.touches[0].clientY - relay.startY

        if (!relay.locked) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
          relay.locked = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical'
        }

        if (relay.locked !== 'horizontal') return

        scrollElement.scrollLeft = Math.max(
          0,
          Math.min(scrollElement.scrollWidth - scrollElement.clientWidth, relay.startScrollLeft - dx)
        )
        event.preventDefault()
      }

      const clearRelay = () => {
        relay = null
      }

      surface.addEventListener('touchstart', onTouchStart, { passive: true })
      surface.addEventListener('touchmove', onTouchMove, { passive: false })
      surface.addEventListener('touchend', clearRelay)
      surface.addEventListener('touchcancel', clearRelay)

      cleanup = () => {
        surface.removeEventListener('touchstart', onTouchStart)
        surface.removeEventListener('touchmove', onTouchMove)
        surface.removeEventListener('touchend', clearRelay)
        surface.removeEventListener('touchcancel', clearRelay)
      }

      return true
    }

    if (!attach()) {
      frameId = requestAnimationFrame(() => {
        attach()
      })
    }

    return () => {
      cancelAnimationFrame(frameId)
      cleanup?.()
    }
  }, [enabled, isDraggingRef, scrollElementId, surfaceRef])
}
