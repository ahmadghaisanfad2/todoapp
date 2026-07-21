import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useTheme } from '@/hooks/useTheme'
import { useSettingsStore } from '@/store/settingsStore'
import {
  COLOR_THEMES,
  CUSTOM_THEME_ID,
  HUE_SLIDER_GRADIENT,
  hslString,
} from '@/lib/colorThemes'
import { cn } from '@/lib/utils'
import type { Theme } from '@/types'

const MODES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

const CUSTOM_SWATCH =
  'conic-gradient(hsl(0 65% 55%), hsl(60 65% 55%), hsl(120 65% 55%), hsl(180 65% 55%), hsl(240 65% 55%), hsl(300 65% 55%), hsl(360 65% 55%))'

interface HueSliderProps {
  label: string
  hue: number
  onChange: (hue: number) => void
}

function HueSlider({ label, hue, onChange }: HueSliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span
          className="h-4 w-4 rounded-full border border-black/10"
          style={{ backgroundColor: `hsl(${hue} 62% 50%)` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={359}
        value={hue}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} hue`}
        style={{ background: HUE_SLIDER_GRADIENT }}
      />
    </div>
  )
}

interface ThemeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeSheet({ open, onOpenChange }: ThemeSheetProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const colorTheme = useSettingsStore((s) => s.colorTheme)
  const primaryHue = useSettingsStore((s) => s.customPrimaryHue)
  const accentHue = useSettingsStore((s) => s.customAccentHue)
  const setColorTheme = useSettingsStore((s) => s.setColorTheme)
  const setCustomHues = useSettingsStore((s) => s.setCustomHues)

  const handleHueChange = (nextPrimary: number, nextAccent: number) => {
    if (colorTheme !== CUSTOM_THEME_ID) setColorTheme(CUSTOM_THEME_ID)
    setCustomHues(nextPrimary, nextAccent)
  }

  const isCustom = colorTheme === CUSTOM_THEME_ID

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 sm:max-w-sm rounded-l-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-semibold">Appearance</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Mode</span>
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-border/60 bg-muted p-1">
              {MODES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                    theme === value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Color theme</span>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_THEMES.map((preset) => {
                const values = preset[resolvedTheme]
                const selected = colorTheme === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => setColorTheme(preset.id)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                      selected
                        ? 'border-primary text-foreground ring-1 ring-primary'
                        : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                    )}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border border-black/5"
                      style={{
                        background: `linear-gradient(135deg, ${hslString(values.primary)} 50%, ${hslString(values.accent)} 50%)`,
                      }}
                    />
                    <span className="truncate">{preset.name}</span>
                    {selected && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />}
                  </button>
                )
              })}
              <button
                onClick={() => setColorTheme(CUSTOM_THEME_ID)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                  isCustom
                    ? 'border-primary text-foreground ring-1 ring-primary'
                    : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-black/5"
                  style={{ background: CUSTOM_SWATCH }}
                />
                <span className="truncate">Custom</span>
                {isCustom && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />}
              </button>
            </div>
          </div>

          {isCustom && (
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-3">
              <HueSlider
                label="Primary"
                hue={primaryHue}
                onChange={(h) => handleHueChange(h, accentHue)}
              />
              <HueSlider
                label="Accent"
                hue={accentHue}
                onChange={(h) => handleHueChange(primaryHue, h)}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
