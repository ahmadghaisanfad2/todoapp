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
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      {isEntering && (
        <div className="fixed inset-0 z-[60] flex animate-lp-entering flex-col items-center justify-center gap-5 bg-background/90 backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Logo className="h-8 w-8 animate-lp-spin" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground font-brand" style={{ fontWeight: 600 }}>Menyiapkan ruang kerja Anda</p>
            <p className="mt-0.5 font-mono text-sm text-muted-foreground">Sebentar...</p>
          </div>
        </div>
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>
      <LandingNav onNavigateApp={() => setIsEntering(true)} />
      <main id="main-content">
        <LandingHero onNavigateApp={() => setIsEntering(true)} />
      </main>
    </div>
  )
}
