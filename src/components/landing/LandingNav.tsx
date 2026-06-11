import { Button } from '@/components/ui/button'

interface LandingNavProps {
  onNavigateApp: () => void
}

export function LandingNav({ onNavigateApp }: LandingNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-background">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground font-sans">Wazheefa</span>
        </div>
        <Button
          onClick={onNavigateApp}
          variant="ghost"
          className="rounded-xl text-sm font-medium font-sans text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Buka Aplikasi
        </Button>
      </div>
    </header>
  )
}
