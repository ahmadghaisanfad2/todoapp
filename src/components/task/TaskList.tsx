import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { EmptyState, SearchX } from '@/components/common/EmptyState'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types'

interface TaskListProps {
  activeTasks: Task[]
  completedTasks: Task[]
  hasActiveFilters?: boolean
  onEdit: (task: Task) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ activeTasks, completedTasks, hasActiveFilters = false, onEdit, onToggle, onDelete }: TaskListProps) {
  const [completedExpanded, setCompletedExpanded] = useState(false)

  if (activeTasks.length === 0 && completedTasks.length === 0) {
    if (hasActiveFilters) {
      return (
        <EmptyState
          icon={SearchX}
          message="No matching tasks"
          description="Try adjusting your filters or search query."
        />
      )
    }
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
          <p className="pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active · {activeTasks.length}
          </p>
          {activeTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </>
      )}

      {completedTasks.length > 0 && (
        <>
          <Separator className="my-3" />
          <button
            className="flex items-center gap-1.5 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            onClick={() => setCompletedExpanded((v) => !v)}
          >
            {completedExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
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
