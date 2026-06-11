import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingCTAProps {
  onNavigateApp: () => void
}

export function LandingCTA({ onNavigateApp }: LandingCTAProps) {
  return (
    <section className="relative py-24 md:py-32 bg-secondary/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary/[0.07] rounded-full blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-foreground mb-4 leading-tight">
          Pekerjaan tidak akan selesai sendiri.<br />
          <span className="text-primary">Tapi bisa dimulai.</span>
        </h2>
        <p className="text-base text-muted-foreground mb-9 leading-relaxed">
          Buka aplikasi, catat apa yang perlu dilakukan, dan mulai dari yang paling penting.
        </p>
        <Button
          onClick={onNavigateApp}
          size="lg"
          className="h-12 rounded-2xl bg-primary px-9 text-sm font-bold font-mono shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] animate-pulse-glow"
        >
          Masuk ke Aplikasi
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="mt-4 text-xs font-mono text-muted-foreground">
          Simpan lokal di browser. Tidak perlu akun.
        </p>
      </div>
    </section>
  )
}
