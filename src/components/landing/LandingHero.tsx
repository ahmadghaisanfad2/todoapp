import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingHeroProps {
  onNavigateApp: () => void
}

export function LandingHero({ onNavigateApp }: LandingHeroProps) {
  return (
    <section className="relative pt-16 pb-28 md:pt-24 md:pb-36">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/[0.06] rounded-full blur-[120px] -translate-y-1/2" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground leading-[1.1]">
              Punya banyak tugas<br />
              tapi tidak tahu<br />
              <span className="text-primary"> dari mana mulai?</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[48ch]">
              Wazheefa membantu Anda mencatat apa yang perlu dilakukan, mengurutkan mana yang paling penting, dan menyelesaikan satu per satu tanpa merasa kewalahan.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button
                onClick={onNavigateApp}
                size="lg"
                className="h-11 rounded-2xl bg-primary px-7 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98]"
              >
                Masuk ke Aplikasi
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground leading-snug max-w-[20ch]">
                Tidak perlu daftar. Langsung buka dan pakai.
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
                <span className="ml-2 text-[11px] text-muted-foreground font-medium">Wazheefa</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 flex-1 rounded-lg border border-input bg-background px-3 text-[12px] text-muted-foreground flex items-center">Cari tugas...</div>
                  <div className="h-8 px-3 rounded-lg border border-input bg-background text-[11px] text-muted-foreground flex items-center">Semua</div>
                  <div className="h-8 px-3 rounded-lg border border-input bg-background text-[11px] text-muted-foreground flex items-center">Prioritas</div>
                </div>
                <div className="space-y-2">
                  {[
                    { title: 'Review sprint backlog dengan tim', priority: 'tinggi', cat: 'Kerja', done: false, time: 'Hari ini · 14.00' },
                    { title: 'Kirim proposal ke klien baru', priority: 'sedang', cat: 'Kerja', done: false, time: 'Besok' },
                    { title: 'Belanja mingguan', priority: 'rendah', cat: 'Pribadi', done: false, time: '' },
                    { title: 'Sprint planning Q2', priority: 'tinggi', cat: 'Kerja', done: true, time: 'Kemarin' },
                  ].map((task, i) => (
                    <div key={i} className={`flex items-start gap-3 rounded-xl border border-border/40 bg-card px-4 py-3 ${task.done ? 'opacity-45' : ''}`}>
                      <div className={`mt-0.5 h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center ${task.done ? 'bg-primary border-primary' : 'border-border'}`}>
                        {task.done && (
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="text-primary-foreground">
                            <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-medium text-foreground leading-snug ${task.done ? 'line-through' : ''}`}>{task.title}</p>
                        {task.time && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">{task.time}</p>
                        )}
                      </div>
                      <div className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        task.priority === 'tinggi' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'sedang' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 z-0 rounded-xl border border-border/60 bg-card/90 backdrop-blur-sm px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Langsung terbuka</p>
                  <p className="text-[11px] text-muted-foreground">Simpan di browser, tanpa server</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}