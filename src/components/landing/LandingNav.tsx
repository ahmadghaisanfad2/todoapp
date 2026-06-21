import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'

interface LandingNavProps {
  onNavigateApp: () => void
}

export function LandingNav({ onNavigateApp }: LandingNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 dark:border-border/40 dark:bg-background/70 dark:supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Logo className="h-5 w-5" />
          </div>
          <span className="font-brand text-lg tracking-tight text-foreground" style={{ fontWeight: 700 }}>Wazheefa</span>
        </div>

        <Button
          onClick={onNavigateApp}
          size="sm"
          className="rounded-lg bg-primary px-4 text-xs font-semibold font-mono text-primary-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/20"
        >
          Mulai Sekarang
        </Button>
      </div>
    </header>
  )
}
