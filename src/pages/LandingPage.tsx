import { useEffect, useState } from 'react'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingNav } from '@/components/landing/LandingNav'

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
    <div className="min-h-[100dvh] bg-slate-950 text-white">
      {isEntering && (
        <div className="fixed inset-0 z-50 flex animate-lp-entering flex-col items-center justify-center gap-5 bg-slate-950/90 backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-lp-spin text-emerald-300">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-sans text-base font-semibold text-white">Menyiapkan ruang kerja Anda</p>
            <p className="mt-0.5 font-mono text-sm text-white/55">Sebentar...</p>
          </div>
        </div>
      )}

      <LandingNav onNavigateApp={() => setIsEntering(true)} />
      <main>
        <LandingHero onNavigateApp={() => setIsEntering(true)} />
      </main>
      <LandingFooter onNavigateApp={() => setIsEntering(true)} />
    </div>
  )
}
