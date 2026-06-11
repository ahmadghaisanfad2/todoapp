import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TimerSetupProps {
  onStart: (seconds: number) => void
}

const PRESETS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
]

export function TimerSetup({ onStart }: TimerSetupProps) {
  const [customMinutes, setCustomMinutes] = useState('')

  const handleCustomStart = () => {
    const mins = parseInt(customMinutes, 10)
    if (mins > 0 && mins <= 120) {
      onStart(mins * 60)
      setCustomMinutes('')
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Pick a duration
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            onClick={() => onStart(preset.seconds)}
            className={cn(
              'rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium',
              'transition-all duration-150 hover:border-primary hover:bg-primary/5 hover:text-primary',
              'active:scale-95'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={120}
          placeholder="Custom (min)"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomStart()}
          className="h-9 text-sm"
        />
        <Button
          size="sm"
          onClick={handleCustomStart}
          disabled={!customMinutes || parseInt(customMinutes, 10) <= 0}
          className="h-9 px-3"
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
