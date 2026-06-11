import { useTheme } from '@/hooks/useTheme'

interface LogoProps {
  className?: string
  alt?: string
}

export function Logo({ className = 'h-5 w-5', alt = 'Wazheefa' }: LogoProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <img
      src={isDark ? '/logo-dark.svg' : '/logo-light.svg'}
      alt={alt}
      className={className}
    />
  )
}
