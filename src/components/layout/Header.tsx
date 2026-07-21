import { ArrowLeft, Sun, Moon, Monitor, Tags, Plus, Music, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onNavigateHome: () => void
  onCategoryOpen: () => void
  onAddTask: () => void
  onMusicOpen: () => void
  onThemeOpen: () => void
}

export function Header({ onNavigateHome, onCategoryOpen, onAddTask, onMusicOpen, onThemeOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 pt-safe-top backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <button
            onClick={onNavigateHome}
            aria-label="Back to home"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.97] sm:h-auto sm:w-auto sm:gap-2 sm:px-2 sm:py-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Back to home</span>
          </button>
          <div className="hidden h-4 w-px shrink-0 bg-border/60 sm:block" />
          <WorkspaceSwitcher />
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask()}
            className="hidden gap-1.5 rounded-xl text-sm font-medium sm:inline-flex"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
            Add task
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCategoryOpen}
            aria-label="Manage categories"
            className="h-9 w-9 gap-1.5 rounded-xl px-0 sm:h-9 sm:w-auto sm:px-2.5"
          >
            <Tags className="h-4 w-4" />
            <span className="hidden text-xs sm:inline">Categories</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMusicOpen}
            aria-label="Music player"
            className="h-9 w-9 gap-1.5 rounded-xl px-0 sm:h-9 sm:w-auto sm:px-2.5"
          >
            <Music className="h-4 w-4" />
            <span className="hidden text-xs sm:inline">Music</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeOpen}
            aria-label="Customize colors"
            className="gap-1.5 px-2.5"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden text-xs sm:inline">Colors</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            aria-label={`Switch theme (current: ${theme})`}
            className={cn('h-9 w-9 gap-1.5 rounded-xl px-0 sm:h-9 sm:w-auto sm:px-2.5')}
          >
            <ThemeIcon className="h-4 w-4" />
            <span className="hidden text-xs sm:inline">{themeLabel}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
