export function LandingShowcase() {
  return (
    <section id="tampilan" className="relative py-24 md:py-32 bg-secondary/30">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold font-mono uppercase tracking-widest text-primary mb-3">Tampilan</p>
          <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-foreground">
            Rapih. Fokus. Tanpa gangguan.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tidak ada menu berantai, tidak ada notifikasi spam. Cukup daftar tugas dan yang perlu dikerjakan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Task list mockup */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground font-mono">Daftar tugas</span>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Persiapkan deck untuk investor meeting', p: 'Tinggi', done: false },
                { title: 'Audit konten website bulan ini', p: 'Sedang', done: false },
                { title: 'Renew subdomain SSL', p: 'Rendah', done: false },
                { title: 'Update changelog versi 2.1', p: 'Sedang', done: true },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border/40 bg-background/60 px-4 py-3">
                  <div className={`mt-0.5 h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center ${t.done ? 'bg-primary border-primary' : 'border-border'}`}>
                    {t.done && (
                      <svg width="7" height="7" viewBox="0 0 10 10" fill="none" className="text-primary-foreground">
                        <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium text-foreground leading-snug ${t.done ? 'line-through opacity-60' : ''}`}>{t.title}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold font-mono ${
                    t.p === 'Tinggi' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    t.p === 'Sedang' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>{t.p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80"
              alt="Clean workspace for focused productivity"
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-foreground font-mono">Filter &amp; urutkan</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="h-7 px-2.5 rounded-md border border-input bg-background text-[10px] font-mono text-muted-foreground flex items-center">Semua</div>
                <div className="h-7 px-2.5 rounded-md border border-input bg-background text-[10px] font-mono text-muted-foreground flex items-center">Aktif</div>
                <div className="h-7 px-2.5 rounded-md border border-primary bg-primary/5 text-[10px] font-mono text-primary flex items-center">Selesai</div>
                <div className="h-7 px-2.5 rounded-md border border-input bg-background text-[10px] font-mono text-muted-foreground flex items-center">Tinggi</div>
              </div>
              <p className="text-[12px] text-muted-foreground font-mono">1 tugas selesai</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
