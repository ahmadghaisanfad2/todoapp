import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import heroLight from '@/assets/hero-atmosphere-light.png'
import heroDark from '@/assets/hero-atmosphere-dark.png'

interface LandingHeroProps {
  onNavigateApp: () => void
}

export function LandingHero({ onNavigateApp }: LandingHeroProps) {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroLight}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center dark:hidden"
        />
        <img
          src={heroDark}
          alt=""
          aria-hidden="true"
          className="hidden h-full w-full object-cover object-center dark:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background dark:from-background/40 dark:via-background/65 dark:to-background" />
      </div>

      {/* Grain texture */}
      <div className="grain-overlay absolute inset-0 -z-10 pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl items-center px-6 py-24 md:py-32">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          {/* Left — Copy */}
          <div className="flex flex-col gap-8">
            <div className="animate-hero-fade-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Produktivitas tanpa distraksi
              </span>
            </div>

            <div className="animate-hero-fade-2">
              <h1 className="font-brand max-w-[16ch] text-[2.75rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl xl:text-[4.5rem]" style={{ fontWeight: 500 }}>
                Fokus pada yang penting,
              </h1>
              <p className="font-brand mt-1 max-w-[16ch] text-[2.75rem] leading-[1.1] tracking-tight text-primary sm:text-5xl md:text-6xl xl:text-[4.5rem]" style={{ fontWeight: 400 }}>
                selesaikan dengan tenang.
              </p>
              <div className="mt-4 h-px w-16 bg-gradient-to-r from-primary/60 to-transparent" />
            </div>

            <p className="animate-hero-fade-3 max-w-[42ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              Kelola tugas, atur timer fokus, dan putar musik favorit — semuanya dalam satu ruang kerja yang bersih dan efisien.
            </p>

            <div className="animate-hero-fade-4 flex flex-wrap items-center gap-4">
              <Button
                onClick={onNavigateApp}
                size="lg"
                className="h-12 rounded-xl bg-primary px-7 text-sm font-semibold font-mono shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.99]"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <span className="text-sm font-mono text-muted-foreground">
                Gratis. Tidak perlu registrasi.
              </span>
            </div>
          </div>

          {/* Right — Mock card */}
          <div className="animate-hero-fade-3 lg:justify-self-end">
            <div className="relative mx-auto max-w-lg rounded-2xl border border-border/60 bg-card/80 p-5 shadow-2xl shadow-primary/5 backdrop-blur-xl">
              {/* Top accent line */}
              <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Window dots + brand */}
              <div className="flex items-center gap-2 mb-5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                <span className="ml-2 font-brand text-xs text-muted-foreground" style={{ fontWeight: 400 }}>Wazheefa</span>
              </div>

              {/* Task list */}
              <div className="space-y-2.5">
                {[
                  { title: 'Finalisasi desain halaman utama', tag: 'Desain', done: false },
                  { title: 'Tanggapi email dari klien', tag: 'Klien', done: false },
                  { title: 'Review pull request tim', tag: 'Engineering', done: true },
                ].map((t, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl border border-border/50 px-3.5 py-3 transition-colors ${t.done ? 'opacity-50' : ''}`}
                  >
                    <div className={`h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center ${t.done ? 'bg-primary border-primary' : 'border-border'}`}>
                      {t.done && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="text-primary-foreground">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm flex-1 ${t.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{t.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t.tag}</span>
                  </div>
                ))}
              </div>

              {/* Timer / Music widget */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-mono font-semibold text-foreground">25:00</span>
                <div className="h-4 w-px bg-border mx-1" />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0">
                    <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="text-xs text-muted-foreground truncate">Ambient Focus Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
