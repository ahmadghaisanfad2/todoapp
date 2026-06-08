import { useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { useHafalan } from '@/hooks/useHafalan'
import { SantriCard } from './SantriCard'
import { SantriDetail } from './SantriDetail'
import { SantriForm } from './SantriForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/common/EmptyState'

export function SantriList() {
  const { getSantriWithProgress } = useHafalan()
  const [search, setSearch] = useState('')
  const [selectedSantriId, setSelectedSantriId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const filtered = getSantriWithProgress.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedSantri = getSantriWithProgress.find((s) => s.id === selectedSantriId)

  if (selectedSantri) {
    return (
      <SantriDetail
        santri={selectedSantri}
        onBack={() => setSelectedSantriId(null)}
      />
    )
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari santri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button size="icon" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          message={search ? 'Tidak ditemukan' : 'Belum ada santri'}
          description={
            search
              ? 'Coba kata kunci lain'
              : 'Tambahkan santri untuk mulai tracking hafalan'
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((s) => (
            <SantriCard
              key={s.id}
              santri={s}
              onClick={() => setSelectedSantriId(s.id)}
            />
          ))}
        </div>
      )}

      <SantriForm key="new" open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
