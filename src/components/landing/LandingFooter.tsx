interface LandingFooterProps {
  onNavigateApp: () => void
}

export function LandingFooter({ onNavigateApp }: LandingFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <span className="font-sans text-sm font-semibold text-white">Wazheefa</span>
            </div>
            <p className="max-w-[34ch] text-sm leading-6 text-white/62">
              Satu workspace ringan untuk tugas, timer fokus, dan musik yang bikin flow tetap jalan.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <button
              onClick={onNavigateApp}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/16"
            >
              Mulai gratis
            </button>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/52">
              <span>Local-first</span>
              <span>Tidak perlu akun</span>
              <span>Private by default</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-white/42">
            &copy; {new Date().getFullYear()} Wazheefa
          </p>
          <p className="font-mono text-xs text-white/42">
            Dirancang untuk fokus yang tenang, cepat, dan tanpa ribet.
          </p>
        </div>
      </div>
    </footer>
  )
}
