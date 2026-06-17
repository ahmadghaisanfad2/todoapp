import { create } from 'zustand'

const MAX_UNDO_STACK = 20
const CONFIRMATION_MS = 2000

interface UndoEntry {
  id: string
  description: string
  undo: () => void
}

interface UndoState {
  stack: UndoEntry[]
  lastUndone: string | null
  pushUndo: (description: string, undo: () => void) => void
  popUndo: () => void
  dismiss: () => void
}

export const useUndoStore = create<UndoState>()((set, get) => ({
  stack: [],
  lastUndone: null,

  pushUndo: (description, undo) => {
    set((state) => ({
      stack: [
        { id: crypto.randomUUID(), description, undo },
        ...state.stack,
      ].slice(0, MAX_UNDO_STACK),
      lastUndone: null,
    }))
  },

  popUndo: () => {
    const { stack } = get()
    if (stack.length === 0) return
    const [entry, ...rest] = stack
    entry.undo()
    set({ stack: rest, lastUndone: entry.description })
    setTimeout(() => {
      set({ lastUndone: null })
    }, CONFIRMATION_MS)
  },

  dismiss: () => {
    set({ stack: [], lastUndone: null })
  },
}))
