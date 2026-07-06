import { create } from 'zustand'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline'

interface SyncStatusStore {
  status: SyncStatus
  error: string | null
  mergeDialogOpen: boolean
  setStatus: (status: SyncStatus) => void
  setError: (error: string | null) => void
  setMergeDialogOpen: (open: boolean) => void
}

export const useSyncStatusStore = create<SyncStatusStore>((set) => ({
  status: 'idle',
  error: null,
  mergeDialogOpen: false,
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setMergeDialogOpen: (open) => set({ mergeDialogOpen: open }),
}))
