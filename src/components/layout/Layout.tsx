import { ThemeProvider } from '@/components/common/ThemeProvider'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-4 pb-24">
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}
