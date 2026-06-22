import { create } from 'zustand'

const MAX_UNDO_STACK = 10
const TOAST_MS = 6000

let dismissTimer: ReturnType<typeof setTimeout> | null = null

interface UndoEntry {
  id: string
  description: string
  undo: () => void
}

interface UndoState {
  stack: UndoEntry[]
  lastUndone: string | null
  toastHidden: boolean
  pushUndo: (description: string, undo: () => void) => void
  popUndo: () => void
  hideToast: () => void
}

function clearDismissTimer() {
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

function scheduleToastDismiss(
  get: () => UndoState,
  set: (partial: Partial<UndoState> | ((state: UndoState) => Partial<UndoState>)) => void
) {
  clearDismissTimer()
  const { stack, lastUndone, toastHidden } = get()
  if (toastHidden) return
  if (stack.length === 0 && lastUndone === null) return

  dismissTimer = setTimeout(() => {
    dismissTimer = null
    set({ toastHidden: true, lastUndone: null })
  }, TOAST_MS)
}

export const useUndoStore = create<UndoState>()((set, get) => ({
  stack: [],
  lastUndone: null,
  toastHidden: true,

  pushUndo: (description, undo) => {
    set((state) => ({
      stack: [
        { id: crypto.randomUUID(), description, undo },
        ...state.stack,
      ].slice(0, MAX_UNDO_STACK),
      lastUndone: null,
      toastHidden: false,
    }))
    scheduleToastDismiss(get, set)
  },

  popUndo: () => {
    const { stack } = get()
    if (stack.length === 0) return
    clearDismissTimer()
    const [entry, ...rest] = stack
    entry.undo()
    set({ stack: rest, lastUndone: entry.description, toastHidden: false })
    scheduleToastDismiss(get, set)
  },

  hideToast: () => {
    clearDismissTimer()
    set({ toastHidden: true, lastUndone: null })
  },
}))
