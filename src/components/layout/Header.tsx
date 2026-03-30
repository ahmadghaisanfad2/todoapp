import { Sun, Moon, Monitor, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

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
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <h1 className="text-xl font-bold tracking-tight text-primary">TodoFlow</h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCategoryOpen}
            aria-label="Manage categories"
            className="gap-1.5 px-2.5"
          >
            <Tags className="h-4 w-4" />
            <span className="hidden text-xs sm:inline">Categories</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            aria-label={`Switch theme (current: ${theme})`}
            className={cn('gap-1.5 px-2.5')}
          >
            <ThemeIcon className="h-4 w-4" />
            <span className="hidden text-xs sm:inline">{themeLabel}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
