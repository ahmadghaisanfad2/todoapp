import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingHeroProps {
  onNavigateApp: () => void
}

export function LandingHero({ onNavigateApp }: LandingHeroProps) {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-8">
            <div className="animate-hero-fade-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-mono font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Local-first task manager
              </span>
            </div>

            <h1 className="animate-hero-fade-2 font-sans text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-foreground leading-[1.05]">
              Fokus, nikmati<br />
              <span className="text-muted-foreground">prosesnya.</span>
            </h1>

            <p className="animate-hero-fade-3 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[46ch]">
              Catat tugas, nyalakan timer, putar musik favorit dari YouTube, dan biarkan dirimu fokus dalam alur yang nyaman.
            </p>

            <div className="animate-hero-fade-4 flex flex-wrap items-center gap-5 pt-1">
              <Button
                onClick={onNavigateApp}
                size="lg"
                className="h-13 rounded-xl bg-foreground px-8 text-sm font-semibold font-mono text-background shadow-none transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm font-mono text-muted-foreground">
                Gratis. Tidak perlu daftar.
              </p>
            </div>
          </div>

          {/* Right: App Preview Card */}
          <div className="relative hidden lg:block animate-hero-fade-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {/* Window chrome */}
              <div className="flex items-center gap-2 mb-5">
                <div className="h-3 w-3 rounded-full bg-muted" />
                <div className="h-3 w-3 rounded-full bg-muted" />
                <div className="h-3 w-3 rounded-full bg-muted" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">Wazheefa</span>
              </div>

              {/* Task list mock */}
              <div className="space-y-3">
                {[
                  { title: 'Review sprint backlog', tag: 'Design', tagColor: 'bg-primary/10 text-primary', done: false },
                  { title: 'Kirim proposal ke klien', tag: 'Klien', tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', done: false },
                  { title: 'Update changelog v2.1', tag: 'Dev', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', done: true },
                  { title: 'Riset musik lo-fi untuk fokus', tag: 'Vibes', tagColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', done: false },
                ].map((t, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-lg border border-border/60 px-4 py-3 ${t.done ? 'opacity-50' : ''}`}>
                    <div className={`h-4 w-4 rounded border shrink-0 flex items-center justify-center ${t.done ? 'bg-primary border-primary' : 'border-border'}`}>
                      {t.done && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="text-primary-foreground">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-sans flex-1 ${t.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{t.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${t.tagColor}`}>{t.tag}</span>
                  </div>
                ))}
              </div>

              {/* Timer + Music bar */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-sm font-mono text-foreground font-semibold">25:00</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-rose-500">
                      <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans text-foreground truncate">Lofi Hip Hop Radio</p>
                    <p className="text-[10px] font-mono text-muted-foreground">YouTube</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
