import { useSession } from '@/lib/auth-client'
import { runSyncBootstrap } from '@/lib/sync/syncBootstrap'
import {
  setSyncBootstrapped,
  setSyncPushEnabled,
  subscribeSyncPush,
} from '@/lib/sync/syncSubscriptions'
import { useSyncStatusStore } from '@/store/syncStatusStore'
import { useEffect, useRef } from 'react'
import { MergeDialog } from '@/components/sync/MergeDialog'

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const mergeDialogOpen = useSyncStatusStore((s) => s.mergeDialogOpen)
  const bootstrappedRef = useRef(false)
  const userId = session?.user?.id

  useEffect(() => {
    if (isPending) return

    if (!userId) {
      setSyncPushEnabled(false)
      setSyncBootstrapped(false)
      bootstrappedRef.current = false
      useSyncStatusStore.getState().setStatus('idle')
      return
    }

    let unsubscribe: (() => void) | undefined

    const start = async () => {
      setSyncPushEnabled(false)
      try {
        if (!bootstrappedRef.current) {
          await runSyncBootstrap()
          bootstrappedRef.current = true
        }
        setSyncBootstrapped(true)
        setSyncPushEnabled(true)
        unsubscribe = subscribeSyncPush()
      } catch {
        setSyncBootstrapped(false)
        setSyncPushEnabled(false)
      }
    }

    void start()

    return () => {
      unsubscribe?.()
      setSyncPushEnabled(false)
    }
  }, [userId, isPending])

  return (
    <>
      {children}
      <MergeDialog open={mergeDialogOpen} />
    </>
  )
}
