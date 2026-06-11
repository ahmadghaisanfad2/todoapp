import { useTheme } from '@/hooks/useTheme'

interface LogoProps {
  className?: string
  alt?: string
}

export function Logo({ className = 'h-5 w-5', alt = 'Wazheefa' }: LogoProps) {
  const { resolvedTheme } = useTheme()

  return (
    <img
      src={resolvedTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt={alt}
      className={className}
    />
  )
}
