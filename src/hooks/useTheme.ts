import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

function computeResolved(theme: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (theme === 'dark') return 'dark'
  if (theme === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => computeResolved(theme))

  useEffect(() => {
    const applyTheme = (resolved: 'light' | 'dark') => {
      setResolvedTheme(resolved)
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    if (theme !== 'system') {
      applyTheme(theme)
      return
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    applyTheme(mq.matches ? 'dark' : 'light')

    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return { theme, setTheme, resolvedTheme }
}
