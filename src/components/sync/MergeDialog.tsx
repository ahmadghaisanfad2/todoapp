import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { applyCloudData, applyLocalData } from '@/lib/sync/syncBootstrap'
import { useState } from 'react'

interface MergeDialogProps {
  open: boolean
}

export function MergeDialog({ open }: MergeDialogProps) {
  const [loading, setLoading] = useState<'cloud' | 'local' | null>(null)

  const handleCloud = async () => {
    setLoading('cloud')
    try {
      await applyCloudData()
    } finally {
      setLoading(null)
    }
  }

  const handleLocal = async () => {
    setLoading('local')
    try {
      await applyLocalData()
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Sync conflict</DialogTitle>
          <DialogDescription>
            Data exists both on this device and in the cloud. Choose which copy to keep.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={() => void handleCloud()}
            disabled={loading !== null}
            className="w-full"
          >
            {loading === 'cloud' ? 'Applying…' : 'Use cloud data'}
          </Button>
          <Button
            variant="outline"
            onClick={() => void handleLocal()}
            disabled={loading !== null}
            className="w-full"
          >
            {loading === 'local' ? 'Uploading…' : 'Keep this device'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
