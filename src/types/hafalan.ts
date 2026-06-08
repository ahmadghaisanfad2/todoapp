export type LogType = 'setor' | 'murajaah' | 'ziyadah'
export type HafalanStatus = 'not_started' | 'in_progress' | 'completed'

export interface HafalanTask {
  id: string
  title: string
  description: string | null
  personalFor: string | null // santriId if personal, null if shared to all
  createdAt: string
}

export interface Santri {
  id: string
  name: string
  targetTaskIds: string[]
  createdAt: string
}

export interface HafalanLog {
  id: string
  santriId: string
  taskId: string
  type: LogType
  timestamp: string
  notes: string | null
}
