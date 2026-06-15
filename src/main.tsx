import { useState, useEffect } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { runMigration, migrateTaskStatus, migrateWorkspaceIds } from '@/lib/migrate'
import { AppPage } from '@/pages/AppPage'
import { LandingPage } from '@/pages/LandingPage'
import { useUndoKeyboard } from '@/hooks/useUndoKeyboard'
import { UndoToast } from '@/components/common/UndoToast'

runMigration()
migrateTaskStatus()
migrateWorkspaceIds()

export function Router() {
  const [path, setPath] = useState(window.location.pathname)

  useUndoKeyboard()

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
    return (
      <>
        <AppPage onNavigateHome={() => navigate('/')} />
        <UndoToast />
      </>
    )
  }

  return <LandingPage onNavigateApp={() => navigate('/app')} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)