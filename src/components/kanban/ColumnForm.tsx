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
        className="shrink-0 gap-1.5 border-dashed"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4" />
        Add Column
      </Button>
    )
  }

  return (
    <div className="shrink-0 w-64 rounded-lg border bg-card p-3">
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
        className="w-full rounded border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
      />
      <div className="mt-2 flex gap-1.5">
        <Button size="sm" onClick={handleSubmit} disabled={!name.trim()}>
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
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
