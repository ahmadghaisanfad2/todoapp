interface LandingFooterProps {
  onNavigateApp: () => void
}

export function LandingFooter({ onNavigateApp }: LandingFooterProps) {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Wazheefa</p>
              <p className="text-xs text-muted-foreground">Sederhana. Bersih. Langsung jalan.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-sm text-muted-foreground">
              <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
              <button onClick={onNavigateApp} className="text-left hover:text-foreground transition-colors">Aplikasi</button>
            </div>
            <button
              onClick={onNavigateApp}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Buka Aplikasi &rarr;
            </button>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Data tersimpan di browser Anda.
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Wazheefa
          </p>
        </div>
      </div>
    </footer>
  )
}