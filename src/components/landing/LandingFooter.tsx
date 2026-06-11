interface LandingFooterProps {
  onNavigateApp: () => void
}

export function LandingFooter({ onNavigateApp }: LandingFooterProps) {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-background">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-sm font-bold text-foreground font-sans">Wazheefa</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed max-w-[24ch]">
              Sederhana. Bersih. Langsung jalan.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold font-sans text-foreground mb-3 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onNavigateApp} className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
                  Buka Aplikasi
                </button>
              </li>
              <li>
                <span className="text-xs font-mono text-muted-foreground">Timer</span>
              </li>
              <li>
                <span className="text-xs font-mono text-muted-foreground">Musik & YouTube</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-semibold font-sans text-foreground mb-3 uppercase tracking-wider">Fitur</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-xs font-mono text-muted-foreground">Manajemen Tugas</span>
              </li>
              <li>
                <span className="text-xs font-mono text-muted-foreground">Kategori & Prioritas</span>
              </li>
              <li>
                <span className="text-xs font-mono text-muted-foreground">Hafalan</span>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold font-sans text-foreground mb-3 uppercase tracking-wider">Info</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-xs font-mono text-muted-foreground">Data di browser Anda</span>
              </li>
              <li>
                <span className="text-xs font-mono text-muted-foreground">Tidak perlu akun</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs font-mono text-muted-foreground">
            &copy; {new Date().getFullYear()} Wazheefa
          </p>
          <p className="text-xs font-mono text-muted-foreground">
            Local-first. Private by default.
          </p>
        </div>
      </div>
    </footer>
  )
}
