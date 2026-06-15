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
  const [customHours, setCustomHours] = useState('')
  const [customMinutes, setCustomMinutes] = useState('')

  const handleCustomStart = () => {
    const hrs = parseInt(customHours, 10) || 0
    const mins = parseInt(customMinutes, 10) || 0
    const totalSeconds = hrs * 3600 + mins * 60
    if (totalSeconds > 0 && totalSeconds <= 14400) {
      onStart(totalSeconds)
      setCustomHours('')
      setCustomMinutes('')
    }
  }

  const customTotal = (parseInt(customHours, 10) || 0) * 3600 + (parseInt(customMinutes, 10) || 0) * 60

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Choose duration
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
        <div className="flex items-center gap-1.5 flex-1">
          <Input
            type="number"
            min={0}
            max={4}
            placeholder="0"
            value={customHours}
            onChange={(e) => setCustomHours(e.target.value)}
            className="h-9 text-sm w-14 text-center"
          />
          <span className="text-xs text-muted-foreground">hrs</span>
          <Input
            type="number"
            min={0}
            max={59}
            placeholder="0"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomStart()}
            className="h-9 text-sm w-14 text-center"
          />
          <span className="text-xs text-muted-foreground">min</span>
        </div>
        <Button
          size="sm"
          onClick={handleCustomStart}
          disabled={customTotal <= 0}
          className="h-9 px-3"
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
