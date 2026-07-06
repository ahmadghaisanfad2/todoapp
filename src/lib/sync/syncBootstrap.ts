import { getLocalDataSummary } from '@/lib/sync/localData'
import { fetchSnapshot } from '@/lib/sync/syncPull'
import { hydrateStoresFromSnapshot, pushAllLocalToCloud } from '@/lib/sync/syncPush'
import { useSyncStatusStore } from '@/store/syncStatusStore'

export type BootstrapResult = 'uploaded' | 'downloaded' | 'needs-merge' | 'noop'

export async function runSyncBootstrap(): Promise<BootstrapResult> {
  const { setStatus, setError, setMergeDialogOpen } = useSyncStatusStore.getState()
  setStatus('syncing')
  setError(null)

  try {
    const [snapshot, local] = await Promise.all([
      fetchSnapshot(),
      Promise.resolve(getLocalDataSummary()),
    ])

    if (snapshot.isEmpty && !local.isEmpty) {
      await pushAllLocalToCloud()
      setStatus('synced')
      return 'uploaded'
    }

    if (!snapshot.isEmpty && local.isEmpty) {
      hydrateStoresFromSnapshot(snapshot)
      setStatus('synced')
      return 'downloaded'
    }

    if (!snapshot.isEmpty && !local.isEmpty) {
      setMergeDialogOpen(true)
      setStatus('idle')
      return 'needs-merge'
    }

    setStatus('synced')
    return 'noop'
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Sync failed'
    setError(message)
    setStatus('error')
    throw e
  }
}

export async function applyCloudData() {
  const { setStatus, setError, setMergeDialogOpen } = useSyncStatusStore.getState()
  setStatus('syncing')
  try {
    const snapshot = await fetchSnapshot()
    hydrateStoresFromSnapshot(snapshot)
    setMergeDialogOpen(false)
    setStatus('synced')
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Sync failed'
    setError(message)
    setStatus('error')
    throw e
  }
}

export async function applyLocalData() {
  const { setStatus, setError, setMergeDialogOpen } = useSyncStatusStore.getState()
  setStatus('syncing')
  try {
    await pushAllLocalToCloud()
    setMergeDialogOpen(false)
    setStatus('synced')
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Sync failed'
    setError(message)
    setStatus('error')
    throw e
  }
}
