interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>
      <div
        id="main-content"
        className="mx-auto w-full max-w-5xl px-3 pb-[calc(8rem+env(safe-area-inset-bottom,0px))] sm:px-6 lg:px-8 sm:pb-32"
      >
        {children}
      </div>
    </div>
  )
}
