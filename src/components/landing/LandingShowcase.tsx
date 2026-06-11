const KANBAN_COLUMNS = [
  {
    title: 'To Do',
    color: 'bg-muted text-muted-foreground',
    dotColor: 'bg-muted-foreground/40',
    tasks: [
      { title: 'Persiapkan deck untuk investor meeting', p: 'Tinggi' },
      { title: 'Audit konten website bulan ini', p: 'Sedang' },
    ],
  },
  {
    title: 'Sedang Dikerjakan',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dotColor: 'bg-blue-500',
    tasks: [
      { title: 'Renew subdomain SSL', p: 'Tinggi' },
    ],
  },
  {
    title: 'Selesai',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
    tasks: [
      { title: 'Update changelog versi 2.1', p: 'Sedang' },
    ],
  },
]

const PRIORITY_COLORS: Record<string, string> = {
  Tinggi: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Sedang: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  Rendah: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export function LandingShowcase() {
  return (
    <section id="tampilan" className="relative py-24 md:py-32 bg-secondary/30">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold font-mono uppercase tracking-widest text-primary mb-3">Tampilan</p>
          <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-foreground">
            Papan Kanban. Rapih. Visual.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Lihat semua tugas dalam satu papan. Geser antar kolom, atur prioritas, dan pantau progres secara visual.
          </p>
        </div>

        {/* Kanban board mockup */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-primary">
                <rect x="3" y="3" width="7" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-foreground font-mono">Papan Kanban</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {KANBAN_COLUMNS.map((col) => (
              <div key={col.title} className="rounded-lg border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold font-mono ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground">{col.tasks.length}</span>
                </div>
                <div className="space-y-2">
                  {col.tasks.map((task, i) => (
                    <div key={i} className="rounded-md border border-border/40 bg-card px-3 py-2.5">
                      <p className="text-[12px] font-medium text-foreground leading-snug">{task.title}</p>
                      <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold font-mono ${PRIORITY_COLORS[task.p]}`}>
                        {task.p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
