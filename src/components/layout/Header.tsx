import { Sun, Moon, Monitor, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  onCategoryOpen: () => void
}

export function Header({ onCategoryOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <h1 className="text-xl font-bold tracking-tight text-primary">TodoFlow</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCategoryOpen}
            aria-label="Manage categories"
          >
            <Tags className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label={`Switch theme (current: ${theme})`}
          >
            <ThemeIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
