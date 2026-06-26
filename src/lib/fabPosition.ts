import type { CSSProperties } from 'react'

const FAB_INSET = '1.5rem'
const MUSIC_BAR_HEIGHT = '3.5rem'

export function getMobileFabBottomStyle(hasMusicBar: boolean): CSSProperties {
  const safeBottom = `max(${FAB_INSET}, env(safe-area-inset-bottom, 0px))`
  return {
    bottom: hasMusicBar ? `calc(${safeBottom} + ${MUSIC_BAR_HEIGHT})` : safeBottom,
  }
}

export function getMobileFabLeftStyle(): CSSProperties {
  return { left: `max(${FAB_INSET}, env(safe-area-inset-left, 0px))` }
}

export function getMobileFabRightStyle(): CSSProperties {
  return { right: `max(${FAB_INSET}, env(safe-area-inset-right, 0px))` }
}
