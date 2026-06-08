import { useState } from 'react'
import { BookOpen, Users } from 'lucide-react'
import { SantriList } from './SantriList'
import { HafalanTaskList } from './HafalanTaskList'

type HafalanSubTab = 'santri' | 'tasks'

export function HafalanTab() {
  const [activeTab, setActiveTab] = useState<HafalanSubTab>('santri')

  return (
    <div>
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => setActiveTab('santri')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'santri'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          Santri
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Tugas Hafalan
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'santri' ? <SantriList /> : <HafalanTaskList />}
      </div>
    </div>
  )
}
