import { useEffect } from 'react'

const AXIS_LOCK_THRESHOLD = 6

interface TouchScrollState {
  startX: number
  startY: number
  startScrollLeft: number
  axis: 'x' | 'y' | null
  tracking: boolean
}

/**
 * Enables reliable horizontal board scrolling on touch devices when nested
 * vertical scrollers and drag-and-drop would otherwise steal the gesture.
 *
 * Pass the scroll element directly (via callback ref state) so listeners
 * attach when the board mounts after an empty state / store rehydration.
 */
export function useHorizontalTouchScroll(
  scrollEl: HTMLElement | null,
  enabled = true
) {
  useEffect(() => {
    if (!scrollEl || !enabled) return
    const el = scrollEl

    const state: TouchScrollState = {
      startX: 0,
      startY: 0,
      startScrollLeft: 0,
      axis: null,
      tracking: false,
    }

    function reset() {
      state.axis = null
      state.tracking = false
    }

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        reset()
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return

      // Leave native behavior for form controls, links, and explicit buttons
      // (drag handles, column actions). Whole-card drag surfaces are not buttons,
      // so horizontal swipes starting on cards still scroll the board.
      if (target.closest('button, a, input, textarea, select, [data-kanban-scrollbar-thumb]')) {
        reset()
        return
      }

      const touch = event.touches[0]
      state.startX = touch.clientX
      state.startY = touch.clientY
      state.startScrollLeft = el.scrollLeft
      state.axis = null
      state.tracking = true
    }

    function onTouchMove(event: TouchEvent) {
      if (!state.tracking || event.touches.length !== 1) return

      const touch = event.touches[0]
      const dx = touch.clientX - state.startX
      const dy = touch.clientY - state.startY

      if (state.axis === null) {
        if (Math.abs(dx) < AXIS_LOCK_THRESHOLD && Math.abs(dy) < AXIS_LOCK_THRESHOLD) {
          return
        }
        state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      }

      if (state.axis !== 'x') return

      // Own the horizontal gesture so nested column overflow-y and dnd-kit
      // cannot leave the board stuck between columns.
      event.preventDefault()
      el.scrollLeft = state.startScrollLeft - dx
    }

    function onTouchEnd() {
      reset()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true, capture: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true, capture: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart, true)
      el.removeEventListener('touchmove', onTouchMove, true)
      el.removeEventListener('touchend', onTouchEnd, true)
      el.removeEventListener('touchcancel', onTouchEnd, true)
    }
  }, [scrollEl, enabled])
}
