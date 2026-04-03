export function LandingShowcase() {
  return (
    <section id="tampilan" className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Tampilan</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Rapih. Fokus. Tanpa gangguan.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tidak ada menu berantai, tidak ada notifikasi spam. Cukup daftar tugas dan yang perlu dikerjakan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/40">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-violet-600 dark:text-violet-400">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground">Daftar tugas</span>
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
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    t.p === 'Tinggi' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    t.p === 'Sedang' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>{t.p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/40">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-blue-600 dark:text-blue-400">
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground">Filter &amp; urutkan</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="h-8 px-3 rounded-lg border border-input bg-background text-[11px] text-muted-foreground flex items-center">Semua tugas</div>
              <div className="h-8 px-3 rounded-lg border border-input bg-background text-[11px] text-muted-foreground flex items-center">Aktif</div>
              <div className="h-8 px-3 rounded-lg border border-primary bg-primary/5 text-[11px] text-primary flex items-center">Selesai</div>
              <div className="h-8 px-3 rounded-lg border border-input bg-background text-[11px] text-muted-foreground flex items-center">Tinggi</div>
              <div className="h-8 px-3 rounded-lg border border-input bg-background text-[11px] text-muted-foreground flex items-center">Kategori</div>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Update changelog versi 2.1', cat: 'Kerja', time: 'Kemarin' },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/30 px-4 py-3 opacity-60">
                  <div className="mt-0.5 h-4 w-4 rounded border-2 bg-primary border-primary shrink-0 flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 10 10" fill="none" className="text-primary-foreground">
                      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground line-through leading-snug">{t.title}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t.cat}</span>
                    <span className="text-[10px] text-muted-foreground">{t.time}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                  <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                1 tugas selesai
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}