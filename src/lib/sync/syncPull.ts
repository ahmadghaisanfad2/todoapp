import { apiFetch } from '@/lib/api'
import type { SyncSnapshot } from '@/lib/sync/types'

export async function fetchSnapshot(): Promise<SyncSnapshot> {
  const res = await apiFetch('/api/sync/snapshot')
  if (!res.ok) {
    throw new Error(`Failed to fetch snapshot: ${res.status}`)
  }
  return res.json() as Promise<SyncSnapshot>
}
