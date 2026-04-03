import { Button } from '@/components/ui/button'

interface LandingNavProps {
  onNavigateApp: () => void
}

export function LandingNav({ onNavigateApp }: LandingNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Wazheefa</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#fitur" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Fitur</a>
          <a href="#tampilan" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Tampilan</a>
          <a href="#testimoni" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Testimoni</a>
        </nav>
        <Button
          onClick={onNavigateApp}
          className="h-9 rounded-xl bg-primary text-sm font-semibold shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          Masuk ke Aplikasi
        </Button>
      </div>
    </header>
  )
}