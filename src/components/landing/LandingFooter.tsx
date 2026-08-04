import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'

interface LandingFooterProps {
  onNavigateApp: () => void
}

export function LandingFooter({ onNavigateApp }: LandingFooterProps) {
  return (
    <footer className="border-t border-border/70 bg-background pb-safe">
      <div className="mx-auto max-w-6xl px-safe pb-10 pt-14 sm:pt-16 lg:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Logo className="h-5 w-5" />
              </div>
              <span
                className="font-brand text-lg tracking-tight text-foreground"
                style={{ fontWeight: 700 }}
              >
                Wazheefa
              </span>
            </div>
            <p className="mt-4 font-serif text-[1.35rem] leading-snug tracking-tight text-foreground/90 sm:text-2xl">
              Fokus pada yang penting,
              <br />
              <span className="italic text-[hsl(158_62%_28%)] dark:text-primary">
                selesaikan dengan tenang.
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <Button
              onClick={onNavigateApp}
              size="lg"
              className="h-12 rounded-xl bg-primary px-6 font-mono text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99]"
            >
              Mulai Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
              <span>Gratis</span>
              <span aria-hidden="true">·</span>
              <span>Tanpa registrasi</span>
              <span aria-hidden="true">·</span>
              <span>Data lokal</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Wazheefa. Dibuat dengan ketenangan.
          </p>
          <p className="text-xs text-muted-foreground">
            Ruang kerja fokus yang menghormati waktu dan privasimu.
          </p>
        </div>
      </div>
    </footer>
  )
}
