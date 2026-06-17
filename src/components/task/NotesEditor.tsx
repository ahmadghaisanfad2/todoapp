import { useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface NotesEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function getListPrefix(line: string): string | null {
  const numberedMatch = line.match(/^(\d+)\.\s/)
  if (numberedMatch) {
    return `${Number(numberedMatch[1]) + 1}. `
  }
  const bulletMatch = line.match(/^[-*]\s/)
  if (bulletMatch) {
    return `${bulletMatch[0][0]} `
  }
  return null
}

export function NotesEditor({ value, onChange, placeholder = 'Add notes...' }: NotesEditorProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== 'Enter' || e.shiftKey) return

      const textarea = e.currentTarget
      const { selectionStart } = textarea
      const textBefore = value.slice(0, selectionStart)
      const currentLine = textBefore.split('\n').pop() ?? ''

      const prefix = getListPrefix(currentLine)
      if (!prefix) return

      // If the current line is just a bare marker with no content, don't continue
      const bareMarker = currentLine.match(/^(\d+\.\s|[-*]\s)$/)
      if (bareMarker) return

      e.preventDefault()
      const textAfter = value.slice(selectionStart)
      const newValue = textBefore + '\n' + prefix + textAfter
      onChange(newValue)

      // Move cursor after the inserted prefix
      requestAnimationFrame(() => {
        const newPos = selectionStart + 1 + prefix.length
        textarea.setSelectionRange(newPos, newPos)
      })
    },
    [value, onChange]
  )

  return (
    <Textarea
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="min-h-[120px] rounded-xl resize-y"
    />
  )
}
