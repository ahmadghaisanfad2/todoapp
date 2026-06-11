import { ArrowRight, CheckCircle2, Columns3, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingHeroProps {
  onNavigateApp: () => void
}

const HIGHLIGHTS = [
  'Papan Kanban, timer, dan player dalam satu flow',
  'Geser tugas antar kolom untuk kelola alur kerja',
  'Semua data tetap di browser Anda',
]

const KANBAN_COLUMNS = [
  {
    title: 'To Do',
    dotColor: 'bg-white/40',
    tasks: ['Finalize launch copy', 'Review pricing notes'],
  },
  {
    title: 'Aktif',
    dotColor: 'bg-sky-400',
    tasks: ['Rekonsiliasi feedback'],
  },
  {
    title: 'Selesai',
    dotColor: 'bg-emerald-400',
    tasks: ['Setup analytics'],
  },
]

export function LandingHero({ onNavigateApp }: LandingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <img
          src="/landing-hero-bg.svg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-95"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.04)_0%,rgba(2,6,23,0.5)_48%,rgba(2,6,23,0.94)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-slate-950 via-slate-950/88 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-7xl items-center px-6 py-16 md:py-20">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-10 xl:gap-16">
          <div className="flex flex-col gap-8">
            <div className="animate-hero-fade-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/74 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                Flow-state productivity
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="animate-hero-fade-2 max-w-[11ch] font-sans text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl xl:text-[5.6rem]">
                Fokus lebih tenang, kerja lebih dalam.
              </h1>
              <p className="animate-hero-fade-3 max-w-[34rem] text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
                Wazheefa menyatukan papan Kanban, timer fokus, dan musik YouTube dalam satu workspace yang terasa halus, ringan, dan siap dipakai kapan saja.
              </p>
            </div>

            <div className="animate-hero-fade-4 flex flex-wrap items-center gap-4">
              <Button
                onClick={onNavigateApp}
                size="lg"
                className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-[0_18px_48px_rgba(255,255,255,0.16)] transition-transform duration-200 hover:scale-[1.02] hover:bg-white/95 active:scale-[0.99]"
              >
                Buka workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/62 backdrop-blur-xl">
                Gratis. Tidak perlu akun. Langsung jalan.
              </div>
            </div>

            <div className="grid gap-3 sm:max-w-xl sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-white/74 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
                >
                  <CheckCircle2 className="mb-3 h-4 w-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-hero-fade-3 lg:justify-self-end">
            <div className="animate-hero-panel-breathe relative mx-auto max-w-[34rem] rounded-[2rem] border border-white/12 bg-white/8 p-4 shadow-[0_30px_120px_rgba(4,10,25,0.55)] backdrop-blur-2xl">
              <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              <div className="rounded-[1.65rem] border border-white/10 bg-slate-950/72 p-4 sm:p-5">
                <div className="mb-5 flex items-center justify-between gap-4 rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Columns3 className="h-4 w-4 text-emerald-300" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Workflow</p>
                      <p className="mt-0.5 text-sm font-medium text-white">Papan Kanban</p>
                    </div>
                  </div>
                  <div className="rounded-full border border-emerald-400/25 bg-emerald-400/12 px-3 py-1 text-[11px] font-medium text-emerald-200">
                    Aktif
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {KANBAN_COLUMNS.map((col) => (
                    <div key={col.title} className="rounded-[1rem] border border-white/8 bg-white/4 p-3">
                      <div className="mb-3 flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${col.dotColor}`} />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">{col.title}</span>
                      </div>
                      <div className="space-y-2">
                        {col.tasks.map((task) => (
                          <div key={task} className="rounded-lg border border-white/7 bg-slate-950/55 px-2.5 py-2">
                            <span className="text-[11px] text-white/74 leading-snug">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -right-4 top-8 hidden rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/70 shadow-[0_20px_60px_rgba(2,6,23,0.4)] backdrop-blur-xl xl:block">
                Geser. Atur. Selesaikan.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
