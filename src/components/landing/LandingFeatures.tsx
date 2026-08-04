import { ShieldCheck } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: React.ReactNode
  className?: string
}

/** Applies a one-shot scroll reveal that respects prefers-reduced-motion. */
function Reveal({ children, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={cn('opacity-0', inView && 'animate-scroll-reveal', className)}
    >
      {children}
    </div>
  )
}

function KanbanVisual() {
  return (
    <div className="flex items-stretch justify-center gap-1.5 sm:gap-4">
      {[
        { label: 'Proses', idxActive: true },
        { label: 'Selesai', idxActive: false },
      ].map((col, idx) => (
        <div
          key={col.label}
          className="flex w-[74px] flex-col gap-2 rounded-xl border border-border/70 bg-card p-2.5 shadow-sm sm:w-28"
        >
          <span className="px-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {col.label}
          </span>
          <div className={cn('h-2 w-full rounded-md bg-foreground/10', idx === 0 && 'h-5')} />
          <div className="h-2 w-3/4 rounded-md bg-foreground/10" />
          <div
            className={cn(
              'mt-auto flex h-6 items-center justify-center rounded-md text-white',
              idx === 0 ? 'bg-primary/90' : 'bg-[hsl(158_62%_28%)]'
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-white/70" />
          </div>
        </div>
      ))}
      <div className="flex w-[74px] flex-col gap-2 rounded-xl border border-dashed border-border/70 bg-card/50 p-2.5 sm:w-28">
        <span className="px-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          + Tambah
        </span>
        <div className="mt-1 h-8 w-full rounded-lg border border-dashed border-border/60" />
      </div>
    </div>
  )
}

function TimerVisual() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-border/50 shadow-sm sm:h-44 sm:w-44">
        <span className="absolute inset-0 flex items-center justify-center rounded-full border-[10px] border-t-primary border-r-primary border-b-transparent border-l-transparent" />
        <div className="text-center">
          <div className="font-mono text-3xl font-semibold text-foreground sm:text-4xl">25:00</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Fokus
          </div>
        </div>
      </div>
    </div>
  )
}

function MusicVisual() {
  const bars = [0.45, 0.8, 0.55, 1, 0.65, 0.9, 0.5]
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <div className="flex h-3.5 items-end gap-[3px]">
            {bars.map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-primary"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">Ambient Focus Session</p>
          <p className="text-xs text-muted-foreground">Menyala · lofi</p>
        </div>
        <span className="h-8 w-1 rounded-full bg-border" />
        <span className="font-mono text-sm font-semibold text-foreground">25:00</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full w-2/3 rounded-full bg-primary" />
      </div>
    </div>
  )
}

interface FeatureRowProps {
  kicker: string
  title: string
  description: string
  visual: React.ReactNode
  flip?: boolean
}

function FeatureRow({ kicker, title, description, visual, flip }: FeatureRowProps) {
  return (
    <div className="grid items-center gap-8 border-b border-border py-12 sm:gap-10 md:grid-cols-2 md:gap-16 md:py-16">
      <Reveal className={cn('min-w-0', flip && 'md:order-2')}>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {kicker}
        </p>
        <h3 className="mt-3 max-w-md font-grotesk text-2xl font-medium leading-tight tracking-[-0.01em] text-foreground sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{description}</p>
      </Reveal>
      <Reveal className={cn('min-w-0', flip && 'md:order-1')}>
        <div className="rounded-2xl border border-border/50 bg-background/60 p-3 sm:p-8">
          {visual}
        </div>
      </Reveal>
    </div>
  )
}

/**
 * Editorial product-features section for the landing page.
 * Built as alternating text/visual rows (not a generic icon-card grid), ending
 * on the signature local-first privacy band.
 */
export function LandingFeatures() {
  return (
    <section id="fitur" className="scroll-mt-24 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-safe lg:px-6">
        <Reveal className="max-w-2xl">
          <h2 className="font-serif text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Satu ruang kerja,
            <br />
            <span className="italic text-[hsl(158_62%_28%)] dark:text-primary">tanpa gangguan.</span>
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            Wazheefa menggabungkan papan tugas, timer fokus, dan musik ambient dalam satu
            permukaan yang tenang — dirancang untuk kreator dan pekerja lepas yang ingin
            langsung memulai.
          </p>
        </Reveal>

        <div className="mt-10 border-t border-border">
          <FeatureRow
            kicker="Papan Kanban"
            title="Lihat alur kerja dengan jelas."
            description="Seret dan lepaskan tugas antarkolom untuk mengatur prioritas. Proses, Selesai — semuanya terlihat dalam satu pandangan."
            visual={<KanbanVisual />}
          />
          <FeatureRow
            kicker="Timer Fokus"
            title="Sesuaikan irama fokusmu."
            description="Awali sesi dengan hitung mundur yang menenangkan. Hadiah bunyi lembut saat waktunya selesai, tanpa drama."
            visual={<TimerVisual />}
            flip
          />
          <FeatureRow
            kicker="Musik Ambient"
            title="Biar suasana tetap tenang."
            description="Putar lofi favoritmu langsung dari ruang kerja. Tidak perlu berpindah tab; fokusmu tetap utuh."
            visual={<MusicVisual />}
          />
        </div>

        {/* Signature: local-first privacy */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-b from-primary/[0.06] to-background p-8 sm:p-12">
            <div className="grain-overlay pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex max-w-xl items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-grotesk text-xl font-medium tracking-[-0.01em] sm:text-2xl">
                    Milikmu. Di perangkatmu.
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    Wazheefa menyimpan semua datamu secara lokal. Tanpa akun, tanpa cloud, tanpa
                    iklan — buka dan mulai saja.
                  </p>
                </div>
              </div>
              <div className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                Lokal · Pribadi · Cepat
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
