import { Sun, Moon, Monitor, Tags, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onCategoryOpen: () => void
  onAddTask: () => void
}

export function Header({ onCategoryOpen, onAddTask }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'

  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Wazheefa</h1>
          <span className="hidden text-sm text-muted-foreground sm:block">
            Stay focused, get things done
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTask}
            className="hidden sm:inline-flex gap-1.5 text-sm font-medium"
            aria-label="New task"
          >
            <Plus className="h-4 w-4" />
            New task
          </Button>
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
