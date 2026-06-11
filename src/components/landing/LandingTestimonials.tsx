const testimonials = [
  {
    quote: "Pertama kali buka, rasanya langsung beda. Tidak ada layar onboarding yang berbelit. Langsung diisi, langsung jalan. Untuk kerja harian, ini memang yang saya butuhkan.",
    name: 'Dimas A.',
    role: 'Software Engineer',
    avatar: 'DA',
  },
  {
    quote: "Saya sering lupa kalau sudah membuat tugas di aplikasi lain. Di Wazheefa, letaknya di browser, selalu ada. Tidak perlu buka aplikasi khusus.",
    name: 'Nisa R.',
    role: 'Content Writer',
    avatar: 'NR',
  },
  {
    quote: "Sebagai freelancer dengan banyak proyek, saya butuh sesuatu yang simpel tapi bisa diatur. Prioritas dan jatuh tempo di sini cukup untuk tidak membuat saya kalap.",
    name: 'Farhan K.',
    role: 'Freelance Designer',
    avatar: 'FK',
  },
]

export function LandingTestimonials() {
  return (
    <section id="testimoni" className="relative py-24 md:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/[0.04] rounded-full blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold font-mono uppercase tracking-widest text-primary mb-3">Testimoni</p>
          <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-foreground">
            Dipakai orang sungguhan.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-primary/[0.02] p-5 transition-all duration-200 hover:shadow-md hover:shadow-primary/5"
            >
              <p className="text-[14px] leading-relaxed text-foreground mb-5 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold font-mono text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
