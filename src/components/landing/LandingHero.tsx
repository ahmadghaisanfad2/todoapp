import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import heroLight from '@/assets/hero-atmosphere-light.webp'
import heroDark from '@/assets/hero-atmosphere-dark.webp'

interface LandingHeroProps {
  onNavigateApp: () => void
}

export function LandingHero({ onNavigateApp }: LandingHeroProps) {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-x-hidden bg-background text-foreground lg:h-[100dvh] lg:overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroLight}
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          className="h-full w-full object-cover object-center dark:hidden"
        />
        <img
          src={heroDark}
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          className="hidden h-full w-full object-cover object-center dark:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/96 to-background dark:from-background/40 dark:via-background/65 dark:to-background" />
      </div>

      <div className="grain-overlay pointer-events-none absolute inset-0 -z-10" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl items-start px-safe pt-nav-safe pb-safe lg:items-center lg:px-6 lg:py-8">
        <div className="grid w-full items-center gap-8 py-6 sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-0">
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="animate-hero-fade-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(158_62%_28%)]/40 bg-background/95 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(158_65%_24%)] shadow-sm backdrop-blur-sm sm:px-4 sm:text-[11px] sm:tracking-[0.2em] dark:border-primary/20 dark:bg-primary/5 dark:font-medium dark:text-primary dark:shadow-none">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(158_65%_24%)] dark:bg-primary" />
                Produktivitas tanpa distraksi
              </span>
            </div>

            <div className="animate-hero-fade-2">
              <p className="mb-3 font-brand text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Wazheefa
              </p>
              <h1
                className="max-w-[18ch] font-serif text-[1.875rem] leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem] sm:leading-[1.05] md:text-5xl xl:text-[4rem]"
                style={{ fontWeight: 700 }}
              >
                <span className="italic text-[hsl(158_62%_28%)] dark:text-primary" style={{ fontWeight: 600 }}>
                  Fokus
                </span>{' '}
                pada yang penting,
              </h1>
              <p
                className="mt-1.5 max-w-[18ch] font-grotesk text-[1.5rem] leading-[1.12] tracking-[-0.02em] text-foreground/90 dark:text-muted-foreground sm:text-[2.25rem] sm:leading-[1.1] md:text-[2.75rem] xl:text-[3.5rem]"
                style={{ fontWeight: 300 }}
              >
                selesaikan dengan tenang.
              </p>
              <div className="mt-4 h-px w-14 bg-gradient-to-r from-[hsl(158_62%_28%)]/70 to-transparent dark:from-primary/60 sm:w-16" />
            </div>

            <p className="animate-hero-fade-3 max-w-[42ch] text-sm leading-relaxed text-foreground/80 dark:text-muted-foreground sm:text-base">
              Kelola tugas, atur timer fokus, dan putar musik favorit — semuanya dalam satu ruang kerja yang bersih dan efisien.
            </p>

            <div className="animate-hero-fade-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                onClick={onNavigateApp}
                size="lg"
                className="h-12 w-full rounded-xl bg-primary px-6 font-mono text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] sm:h-11 sm:w-auto"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <span className="text-center font-mono text-sm text-foreground/75 dark:text-muted-foreground sm:text-left">
                Gratis. Tidak perlu registrasi.
              </span>
            </div>
          </div>

          <div className="animate-hero-fade-3 w-full lg:justify-self-end">
            <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-border/60 bg-card/95 p-3 shadow-2xl shadow-primary/5 backdrop-blur-xl sm:p-4 dark:bg-card/80">
              <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <div className="mb-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57] sm:h-3 sm:w-3" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] sm:h-3 sm:w-3" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28C840] sm:h-3 sm:w-3" />
                <span className="ml-2 font-brand text-xs text-foreground/80 dark:text-muted-foreground" style={{ fontWeight: 600 }}>
                  Wazheefa
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Finalisasi desain halaman utama', tag: 'Desain', done: false },
                  { title: 'Tanggapi email dari klien', tag: 'Klien', done: false },
                  { title: 'Review pull request tim', tag: 'Engineering', done: true },
                ].map((t) => (
                  <div
                    key={t.title}
                    className={`flex items-center gap-2.5 rounded-xl border border-border/50 px-3 py-2.5 transition-colors sm:gap-3 sm:px-3.5 sm:py-3 ${t.done ? 'opacity-70 dark:opacity-50' : ''}`}
                  >
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${t.done ? 'border-primary bg-primary' : 'border-border'}`}>
                      {t.done && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="text-primary-foreground">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`min-w-0 flex-1 truncate text-sm ${t.done ? 'text-foreground/60 line-through dark:text-muted-foreground' : 'text-foreground'}`}>
                      {t.title}
                    </span>
                    <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-medium text-primary dark:bg-primary/10">
                      {t.tag}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-semibold text-foreground">25:00</span>
                <div className="mx-1 h-4 w-px bg-border" />
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
                    <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="truncate text-xs text-foreground/75 dark:text-muted-foreground">Ambient Focus Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
