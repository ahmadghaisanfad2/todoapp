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
    <div className="flex flex-col gap-6">
      {activeTasks.length === 0 ? (
        <EmptyState
          message="All done!"
          description="No active tasks. Add a new one with the New task button."
        />
      ) : (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Active
            </span>
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
              {activeTasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section>
          <Separator className="mb-6" />
          <button
            className="flex items-center gap-2 mb-3 text-left hover:opacity-80 transition-opacity"
            onClick={() => setCompletedExpanded((v) => !v)}
          >
            {completedExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Completed
            </span>
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
              {completedTasks.length}
            </span>
          </button>
          {completedExpanded && (
            <div className="flex flex-col gap-2">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
