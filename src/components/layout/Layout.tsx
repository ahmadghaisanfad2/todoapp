import { ThemeProvider } from '@/components/common/ThemeProvider'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-32">
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}
