import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/common/EmptyState'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types'

interface TaskListProps {
  activeTasks: Task[]
  completedTasks: Task[]
  onEdit: (task: Task) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ activeTasks, completedTasks, onEdit, onToggle, onDelete }: TaskListProps) {
  const [completedExpanded, setCompletedExpanded] = useState(false)

  if (activeTasks.length === 0 && completedTasks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-2">
      {activeTasks.length === 0 ? (
        <EmptyState
          message="All done!"
          description="No active tasks. Add a new one with the + button."
        />
      ) : (
        <>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Active · {activeTasks.length}
          </p>
          {activeTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </>
      )}

      {completedTasks.length > 0 && (
        <>
          <Separator className="my-2" />
          <button
            className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
            onClick={() => setCompletedExpanded((v) => !v)}
          >
            {completedExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            Completed · {completedTasks.length}
          </button>
          {completedExpanded &&
            completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
            ))}
        </>
      )}
    </div>
  )
}
