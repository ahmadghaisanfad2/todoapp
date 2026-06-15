import { useEffect } from 'react'
import { useUndoStore } from '@/store/undoStore'

export function useUndoKeyboard() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      if (!isMod || e.key !== 'z' || e.shiftKey) return

      const target = e.target as HTMLElement
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return

      e.preventDefault()
      useUndoStore.getState().popUndo()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
