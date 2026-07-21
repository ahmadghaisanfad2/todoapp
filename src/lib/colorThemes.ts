export interface ColorThemeValues {
  primary: string
  primaryForeground: string
  ring: string
  accent: string
  accentForeground: string
}

export interface ColorThemePreset {
  id: string
  name: string
  light: ColorThemeValues
  dark: ColorThemeValues
}

export const DEFAULT_COLOR_THEME = 'emerald'
export const CUSTOM_THEME_ID = 'custom'

export const COLOR_THEMES: ColorThemePreset[] = [
  {
    id: 'emerald',
    name: 'Emerald',
    light: {
      primary: '160 60% 40%',
      primaryForeground: '0 0% 100%',
      ring: '160 60% 40%',
      accent: '155 10% 95%',
      accentForeground: '155 25% 10%',
    },
    dark: {
      primary: '160 55% 55%',
      primaryForeground: '155 25% 6%',
      ring: '160 55% 55%',
      accent: '155 15% 14%',
      accentForeground: '150 15% 95%',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    light: {
      primary: '215 72% 48%',
      primaryForeground: '0 0% 100%',
      ring: '215 72% 48%',
      accent: '215 55% 96%',
      accentForeground: '215 30% 12%',
    },
    dark: {
      primary: '215 72% 62%',
      primaryForeground: '220 30% 7%',
      ring: '215 72% 62%',
      accent: '215 35% 14%',
      accentForeground: '210 20% 93%',
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    light: {
      primary: '262 62% 52%',
      primaryForeground: '0 0% 100%',
      ring: '262 62% 52%',
      accent: '262 45% 96%',
      accentForeground: '262 28% 12%',
    },
    dark: {
      primary: '262 62% 66%',
      primaryForeground: '265 30% 7%',
      ring: '262 62% 66%',
      accent: '262 32% 14%',
      accentForeground: '260 20% 93%',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    light: {
      primary: '347 68% 48%',
      primaryForeground: '0 0% 100%',
      ring: '347 68% 48%',
      accent: '347 50% 96%',
      accentForeground: '347 30% 12%',
    },
    dark: {
      primary: '347 68% 62%',
      primaryForeground: '345 30% 7%',
      ring: '347 68% 62%',
      accent: '347 32% 14%',
      accentForeground: '345 20% 93%',
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    light: {
      primary: '38 92% 45%',
      primaryForeground: '35 50% 12%',
      ring: '38 92% 45%',
      accent: '40 60% 95%',
      accentForeground: '38 35% 12%',
    },
    dark: {
      primary: '40 90% 58%',
      primaryForeground: '38 45% 8%',
      ring: '40 90% 58%',
      accent: '40 40% 13%',
      accentForeground: '42 30% 92%',
    },
  },
  {
    id: 'teal',
    name: 'Teal',
    light: {
      primary: '190 72% 36%',
      primaryForeground: '0 0% 100%',
      ring: '190 72% 36%',
      accent: '190 45% 95%',
      accentForeground: '190 30% 10%',
    },
    dark: {
      primary: '190 70% 55%',
      primaryForeground: '192 35% 7%',
      ring: '190 70% 55%',
      accent: '190 32% 13%',
      accentForeground: '188 18% 93%',
    },
  },
  {
    id: 'orange',
    name: 'Orange',
    light: {
      primary: '24 85% 50%',
      primaryForeground: '0 0% 100%',
      ring: '24 85% 50%',
      accent: '26 60% 95%',
      accentForeground: '24 35% 12%',
    },
    dark: {
      primary: '26 85% 60%',
      primaryForeground: '24 40% 8%',
      ring: '26 85% 60%',
      accent: '26 38% 13%',
      accentForeground: '28 25% 93%',
    },
  },
  {
    id: 'slate',
    name: 'Slate',
    light: {
      primary: '215 18% 40%',
      primaryForeground: '0 0% 100%',
      ring: '215 18% 40%',
      accent: '215 12% 95%',
      accentForeground: '215 22% 12%',
    },
    dark: {
      primary: '215 15% 62%',
      primaryForeground: '215 25% 7%',
      ring: '215 15% 62%',
      accent: '215 12% 14%',
      accentForeground: '210 12% 93%',
    },
  },
]

function foregroundFor(hue: number, saturation: number, lightness: number): string {
  const a = saturation * Math.min(lightness, 1 - lightness)
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12
    return lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4)
  return luminance > 0.55 ? '0 0% 10%' : '0 0% 100%'
}

function customThemeValues(
  primaryHue: number,
  accentHue: number,
  mode: 'light' | 'dark'
): ColorThemeValues {
  if (mode === 'light') {
    return {
      primary: `${primaryHue} 62% 42%`,
      primaryForeground: foregroundFor(primaryHue, 0.62, 0.42),
      ring: `${primaryHue} 62% 42%`,
      accent: `${accentHue} 40% 96%`,
      accentForeground: `${accentHue} 25% 12%`,
    }
  }
  return {
    primary: `${primaryHue} 58% 60%`,
    primaryForeground: foregroundFor(primaryHue, 0.58, 0.6),
    ring: `${primaryHue} 58% 60%`,
    accent: `${accentHue} 32% 14%`,
    accentForeground: `${accentHue} 18% 93%`,
  }
}

export function resolveThemeValues(
  id: string,
  mode: 'light' | 'dark',
  primaryHue: number,
  accentHue: number
): ColorThemeValues {
  if (id === CUSTOM_THEME_ID) return customThemeValues(primaryHue, accentHue, mode)
  const preset = COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0]
  return mode === 'dark' ? preset.dark : preset.light
}

export const THEME_CSS_VARS = {
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  ring: '--ring',
  accent: '--accent',
  accentForeground: '--accent-foreground',
} as const satisfies Record<keyof ColorThemeValues, string>

export function hslString(triplet: string): string {
  return `hsl(${triplet})`
}

export const HUE_SLIDER_GRADIENT =
  'linear-gradient(to right, hsl(0 65% 50%), hsl(60 65% 50%), hsl(120 65% 50%), hsl(180 65% 50%), hsl(240 65% 50%), hsl(300 65% 50%), hsl(360 65% 50%))'
