import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const applyTheme = (resolved: 'light' | 'dark') => {
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

  return <>{children}</>
}
