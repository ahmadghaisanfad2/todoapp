import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { RefObject } from 'react'

interface KanbanHorizontalScrollbarProps {
  scrollRef: RefObject<HTMLDivElement | null>
  controlsId?: string
}

interface ScrollMetrics {
  scrollWidth: number
  clientWidth: number
  scrollLeft: number
}

const MIN_THUMB_WIDTH = 24

export function KanbanHorizontalScrollbar({
  scrollRef,
  controlsId = 'kanban-board-scroll',
}: KanbanHorizontalScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    scrollWidth: 0,
    clientWidth: 0,
    scrollLeft: 0,
  })
  const dragState = useRef<{ startX: number; startScrollLeft: number } | null>(null)

  const updateMetrics = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setMetrics({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      scrollLeft: el.scrollLeft,
    })
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    updateMetrics()
    el.addEventListener('scroll', updateMetrics, { passive: true })

    const resizeObserver = new ResizeObserver(updateMetrics)
    resizeObserver.observe(el)

    const mutationObserver = new MutationObserver(updateMetrics)
    mutationObserver.observe(el, { childList: true, subtree: true })

    return () => {
      el.removeEventListener('scroll', updateMetrics)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [scrollRef, updateMetrics])

  const { scrollWidth, clientWidth, scrollLeft } = metrics
  const canScroll = scrollWidth > clientWidth
  const scrollRange = scrollWidth - clientWidth

  const thumbWidth = canScroll
    ? Math.max((clientWidth / scrollWidth) * clientWidth, MIN_THUMB_WIDTH)
    : 0
  const thumbMaxLeft = clientWidth - thumbWidth
  const thumbLeft =
    canScroll && scrollRange > 0 ? (scrollLeft / scrollRange) * thumbMaxLeft : 0

  const setScrollFromRatio = (ratio: number) => {
    const el = scrollRef.current
    if (!el || scrollRange <= 0) return
    el.scrollLeft = Math.max(0, Math.min(scrollRange, ratio * scrollRange))
  }

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || !canScroll) return
    if ((e.target as HTMLElement).dataset.kanbanScrollbarThumb !== undefined) return

    const rect = trackRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = clickX / rect.width
    setScrollFromRatio(ratio)
  }

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragState.current = { startX: e.clientX, startScrollLeft: scrollLeft }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current || !canScroll || thumbMaxLeft <= 0) return
    const deltaX = e.clientX - dragState.current.startX
    const scrollDelta = (deltaX / thumbMaxLeft) * scrollRange
    const el = scrollRef.current
    if (el) {
      el.scrollLeft = Math.max(
        0,
        Math.min(scrollRange, dragState.current.startScrollLeft + scrollDelta)
      )
    }
  }

  const handleThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  if (!canScroll) return null

  return (
    <div
      className="mb-3 px-1"
      role="scrollbar"
      aria-orientation="horizontal"
      aria-controls={controlsId}
      aria-valuenow={Math.round(scrollLeft)}
      aria-valuemin={0}
      aria-valuemax={scrollRange}
      aria-label="Scroll kanban columns horizontally"
    >
      <div
        ref={trackRef}
        data-kanban-scrollbar-track
        className="relative h-2.5 w-full cursor-pointer rounded-full bg-muted"
        onPointerDown={handleTrackPointerDown}
      >
        <div
          data-kanban-scrollbar-thumb
          className={cn(
            'absolute top-0 h-full cursor-grab rounded-full bg-muted-foreground/40',
            'hover:bg-muted-foreground/60 active:cursor-grabbing active:bg-muted-foreground/70'
          )}
          style={{ width: thumbWidth, left: thumbLeft }}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
        />
      </div>
    </div>
  )
}
