import { useEffect, useState } from 'react'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingNav } from '@/components/landing/LandingNav'
import { Logo } from '@/components/common/Logo'

interface LandingPageProps {
  onNavigateApp: () => void
}

export function LandingPage({ onNavigateApp }: LandingPageProps) {
  const [isEntering, setIsEntering] = useState(false)

  useEffect(() => {
    if (!isEntering) return
    const timer = setTimeout(() => {
      onNavigateApp()
    }, 1000)
    return () => clearTimeout(timer)
  }, [isEntering, onNavigateApp])

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      {isEntering && (
        <div className="fixed inset-0 z-[60] flex animate-lp-entering flex-col items-center justify-center gap-5 bg-background/90 backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Logo className="h-8 w-8 animate-lp-spin" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground font-sans">Menyiapkan ruang kerja Anda</p>
            <p className="mt-0.5 font-mono text-sm text-muted-foreground">Sebentar...</p>
          </div>
        </div>
      )}

      <LandingNav onNavigateApp={() => setIsEntering(true)} />
      <main>
        <LandingHero onNavigateApp={() => setIsEntering(true)} />
      </main>
    </div>
  )
}
