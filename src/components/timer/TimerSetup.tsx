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
    <div className="flex flex-col gap-3.5 p-4">
      <div>
        <p className="font-brand text-sm font-semibold tracking-tight text-foreground">Focus timer</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Pick a length and start.</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            onClick={() => onStart(preset.seconds)}
            className={cn(
              'rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm font-medium',
              'transition-all duration-150 hover:border-primary hover:bg-primary/5 hover:text-primary',
              'active:scale-[0.97]'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-border/50 pt-3">
        <div className="flex flex-1 items-center gap-1.5">
          <Input
            type="number"
            min={0}
            max={4}
            placeholder="0"
            value={customHours}
            onChange={(e) => setCustomHours(e.target.value)}
            className="h-10 w-14 rounded-xl text-center text-sm"
            aria-label="Custom hours"
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
            className="h-10 w-14 rounded-xl text-center text-sm"
            aria-label="Custom minutes"
          />
          <span className="text-xs text-muted-foreground">min</span>
        </div>
        <Button
          size="sm"
          onClick={handleCustomStart}
          disabled={customTotal <= 0}
          className="h-10 w-10 rounded-xl px-0"
          aria-label="Start custom timer"
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
