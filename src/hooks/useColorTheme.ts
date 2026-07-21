import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { useTheme } from '@/hooks/useTheme'
import { DEFAULT_COLOR_THEME, resolveThemeValues, THEME_CSS_VARS } from '@/lib/colorThemes'

const OVERRIDE_VARS = [...Object.values(THEME_CSS_VARS), '--emerald', '--emerald-foreground']

export function useColorTheme() {
  const colorTheme = useSettingsStore((s) => s.colorTheme)
  const primaryHue = useSettingsStore((s) => s.customPrimaryHue)
  const accentHue = useSettingsStore((s) => s.customAccentHue)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement

    if (colorTheme === DEFAULT_COLOR_THEME) {
      for (const cssVar of OVERRIDE_VARS) root.style.removeProperty(cssVar)
      return
    }

    const values = resolveThemeValues(colorTheme, resolvedTheme, primaryHue, accentHue)
    root.style.setProperty(THEME_CSS_VARS.primary, values.primary)
    root.style.setProperty(THEME_CSS_VARS.primaryForeground, values.primaryForeground)
    root.style.setProperty(THEME_CSS_VARS.ring, values.ring)
    root.style.setProperty(THEME_CSS_VARS.accent, values.accent)
    root.style.setProperty(THEME_CSS_VARS.accentForeground, values.accentForeground)
    root.style.setProperty('--emerald', values.primary)
    root.style.setProperty('--emerald-foreground', values.primaryForeground)
  }, [colorTheme, resolvedTheme, primaryHue, accentHue])
}
