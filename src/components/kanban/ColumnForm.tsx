import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ColumnFormProps {
  onAdd: (name: string) => void
}

export function ColumnForm({ onAdd }: ColumnFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim())
      setName('')
      setIsAdding(false)
    }
  }

  if (!isAdding) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-11 shrink-0 snap-start gap-1.5 rounded-xl border-dashed px-4 text-muted-foreground hover:text-foreground sm:h-9"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4" />
        Add column
      </Button>
    )
  }

  return (
    <div className="w-[min(16rem,calc(100vw-3rem))] shrink-0 snap-start rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
          if (e.key === 'Escape') {
            setName('')
            setIsAdding(false)
          }
        }}
        placeholder="Column name..."
        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
      <div className="mt-2.5 flex gap-1.5">
        <Button size="sm" onClick={handleSubmit} disabled={!name.trim()} className="h-9 rounded-xl">
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 rounded-xl px-0"
          onClick={() => {
            setName('')
            setIsAdding(false)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
