interface LandingFooterProps {
  onNavigateApp: () => void
}

export function LandingFooter({ onNavigateApp }: LandingFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">Wazheefa</span>
        </div>
        <p className="text-sm text-white/40">
          Workspace produktivitas sederhana. Data tersimpan lokal di browser Anda.
        </p>
        <button
          onClick={onNavigateApp}
          className="text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200"
        >
          Buka workspace
        </button>
        <p className="mt-2 text-xs text-white/25">&copy; {new Date().getFullYear()} Wazheefa</p>
      </div>
    </footer>
  )
}
