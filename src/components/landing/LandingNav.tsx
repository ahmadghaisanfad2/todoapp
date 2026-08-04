import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'

interface LandingNavProps {
  onNavigateApp: () => void
}

export function LandingNav({ onNavigateApp }: LandingNavProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/50 bg-background/90 pt-safe-top backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 dark:border-border/40 dark:bg-background/70 dark:supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-safe lg:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Logo className="h-5 w-5" />
          </div>
          <span className="truncate font-brand text-lg tracking-tight text-foreground" style={{ fontWeight: 700 }}>
            Wazheefa
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Landing">
          <a
            href="#fitur"
            className="font-mono text-xs font-medium text-foreground/70 transition-colors hover:text-primary"
          >
            Fitur
          </a>
        </nav>

        <Button
          onClick={onNavigateApp}
          size="sm"
          className="h-9 shrink-0 rounded-xl bg-primary px-3.5 font-mono text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/20 sm:px-4"
        >
          Mulai Sekarang
        </Button>
      </div>
    </header>
  )
}
