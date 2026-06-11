import { Button } from '@/components/ui/button'

interface LandingNavProps {
  onNavigateApp: () => void
}

export function LandingNav({ onNavigateApp }: LandingNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/35">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-white/55">Focus System</p>
            <span className="font-sans text-base font-semibold tracking-tight text-white">Wazheefa</span>
          </div>
        </div>

        <Button
          onClick={onNavigateApp}
          className="rounded-full border border-white/15 bg-white/10 px-5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-white/16"
        >
          Buka Aplikasi
        </Button>
      </div>
    </header>
  )
}
