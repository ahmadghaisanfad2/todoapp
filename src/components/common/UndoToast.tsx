import { useUndoStore } from '@/store/undoStore'

export function UndoToast() {
  const stack = useUndoStore((s) => s.stack)
  const lastUndone = useUndoStore((s) => s.lastUndone)
  const popUndo = useUndoStore((s) => s.popUndo)

  const shouldShow = stack.length > 0 || lastUndone !== null
  if (!shouldShow) return null

  const isUndoConfirmation = lastUndone !== null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg">
      {isUndoConfirmation ? (
        <span className="text-sm text-muted-foreground">
          Undone: {lastUndone}
        </span>
      ) : (
        <>
          <span className="text-sm text-foreground">
            {stack[0]?.description}
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
  )
}
