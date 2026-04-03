import { useState, useEffect } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { runMigration } from '@/lib/migrate'
import { AppPage } from '@/pages/AppPage'
import { LandingPage } from '@/pages/LandingPage'

runMigration()

export function Router() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    setPath(to)
  }

  if (path === '/app') {
    return <AppPage onNavigateHome={() => navigate('/')} />
  }

  return <LandingPage onNavigateApp={() => navigate('/app')} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)