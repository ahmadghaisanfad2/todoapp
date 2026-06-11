# Kanban Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Wazheefa from a list-based task manager into a Kanban board app, removing the Hafalan feature.

**Architecture:** Kanban board with draggable cards across customizable columns. Uses @dnd-kit for drag-and-drop, Zustand for state, and localStorage persistence.

**Tech Stack:** React 19, Zustand 5, @dnd-kit/core + @dnd-kit/sortable, Tailwind CSS 4, shadcn/ui

---

## File Structure

### New Files
- `src/store/kanbanStore.ts` — Column management (add, update, delete, reorder)
- `src/components/kanban/KanbanBoard.tsx` — Main board with DndContext
- `src/components/kanban/KanbanColumn.tsx` — Single column with droppable zone
- `src/components/kanban/KanbanCard.tsx` — Draggable task card
- `src/components/kanban/ColumnForm.tsx` — Inline add/rename column

### Modified Files
- `src/types/index.ts` — Add status to Task, add KanbanColumn interface
- `src/store/taskStore.ts` — Update addTask for status field
- `src/pages/AppPage.tsx` — Remove Hafalan tab, use KanbanBoard
- `src/components/task/TaskForm.tsx` — Add status selection
- `src/lib/constants.ts` — Add STORAGE_KEYS.KANBAN, default columns
- `src/index.css` — Kanban-specific styles

### Removed Files
- `src/components/hafalan/*` (11 files)
- `src/store/hafalanLogStore.ts`
- `src/store/hafalanTaskStore.ts`
- `src/store/santriStore.ts`
- `src/hooks/useHafalan.ts`
- `src/types/hafalan.ts`

---

### Task 1: Install Dependencies

**Covers:** S5

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @dnd-kit packages**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 2: Verify installation**

```bash
npm ls @dnd-kit/core @dnd-kit/sortable
```

Expected: Both packages listed

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @dnd-kit for Kanban drag-and-drop"
```

---

### Task 2: Update Types

**Covers:** S3

**Files:**
- Modify: `src/types/index.ts`
- Remove: `src/types/hafalan.ts`

- [ ] **Step 1: Update Task interface in `src/types/index.ts`**

```typescript
export interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  categoryId: string | null
  dueDate: string | null
  status: string // column ID (default: 'todo')
  createdAt: string
  updatedAt: string
  order: number
}

export interface Category {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface KanbanColumn {
  id: string
  name: string
  order: number
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  sortBy: 'dueDate' | 'priority' | 'createdAt'
  filterStatus: 'all' | 'active' | 'completed'
  filterCategoryId: string | null
  filterPriority: 'all' | 'high' | 'medium' | 'low'
}

export type Priority = Task['priority']
export type Theme = AppSettings['theme']
export type SortBy = AppSettings['sortBy']
export type FilterStatus = AppSettings['filterStatus']
```

- [ ] **Step 2: Delete hafalan types file**

```bash
rm src/types/hafalan.ts
```

- [ ] **Step 3: Update constants in `src/lib/constants.ts`**

Add to STORAGE_KEYS:
```typescript
KANBAN: 'wazheefa-kanban',
```

Add default columns constant:
```typescript
export const DEFAULT_COLUMNS = [
  { id: 'backlog', name: 'Backlog', order: 0 },
  { id: 'todo', name: 'To Do', order: 1 },
  { id: 'inprogress', name: 'In Progress', order: 2 },
  { id: 'done', name: 'Done', order: 3 },
] as const
```

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/lib/constants.ts
git rm src/types/hafalan.ts
git commit -m "refactor: update types for Kanban, remove hafalan types"
```

---

### Task 3: Create Kanban Store

**Covers:** S3

**Files:**
- Create: `src/store/kanbanStore.ts`

- [ ] **Step 1: Create `src/store/kanbanStore.ts`**

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { KanbanColumn } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS, DEFAULT_COLUMNS } from '@/lib/constants'

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[kanbanStore] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[kanbanStore] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[kanbanStore] Failed to remove from localStorage: ${name}`)
    }
  },
}

interface KanbanStore {
  columns: KanbanColumn[]
  addColumn: (name: string) => void
  updateColumn: (id: string, updates: Partial<Pick<KanbanColumn, 'name'>>) => void
  deleteColumn: (id: string) => void
  reorderColumns: (columns: KanbanColumn[]) => void
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set) => ({
      columns: [...DEFAULT_COLUMNS],
      addColumn: (name) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: generateId(),
              name,
              order: state.columns.length,
            },
          ],
        })),
      updateColumn: (id, updates) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, ...updates } : col
          ),
        })),
      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        })),
      reorderColumns: (columns) => set({ columns }),
    }),
    { name: STORAGE_KEYS.KANBAN, storage: createJSONStorage(() => safeStorage) }
  )
)
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/store/kanbanStore.ts
git commit -m "feat: add kanbanStore for column management"
```

---

### Task 4: Update Task Store

**Covers:** S3

**Files:**
- Modify: `src/store/taskStore.ts`

- [ ] **Step 1: Update taskStore to include status field**

Update addTask default:
```typescript
addTask: (task) =>
  set((state) => ({
    tasks: [
      ...state.tasks,
      {
        ...task,
        id: generateId(),
        status: task.status || 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: state.tasks.filter((t) => t.status === (task.status || 'todo')).length,
      },
    ],
  })),
```

Add moveTask action:
```typescript
moveTask: (id: string, status: string, order: number) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === id
        ? { ...t, status, order, updatedAt: new Date().toISOString() }
        : t
    ),
  })),
```

Update TaskStore interface to include moveTask:
```typescript
interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'> & { status?: string }) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  moveTask: (id: string, status: string, order: number) => void
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/store/taskStore.ts
git commit -m "feat: add status field and moveTask to taskStore"
```

---

### Task 5: Build KanbanCard Component

**Covers:** S4

**Files:**
- Create: `src/components/kanban/KanbanCard.tsx`

- [ ] **Step 1: Create `src/components/kanban/KanbanCard.tsx`**

```typescript
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Calendar, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, parseISO, isPast } from 'date-fns'
import type { Task, Priority } from '@/types'

interface KanbanCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export function KanbanCard({ task, onEdit, onDelete }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-start gap-2 rounded-lg border bg-card px-3 py-2.5 shadow-sm cursor-pointer hover:border-primary/30 transition-colors',
        isDragging && 'opacity-50 shadow-lg',
        isOverdue && 'border-red-300 dark:border-red-800'
      )}
      onClick={() => onEdit(task)}
    >
      <button
        className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium leading-snug', task.completed && 'line-through opacity-60')}>
          {task.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium', priorityColors[task.priority])}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={cn('inline-flex items-center gap-1 text-[10px] text-muted-foreground', isOverdue && 'text-red-500')}>
              <Calendar className="h-3 w-3" />
              {format(parseISO(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
      </div>
      <button
        className="opacity-0 group-hover:opacity-100 mt-0.5 text-muted-foreground hover:text-destructive transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/kanban/KanbanCard.tsx
git commit -m "feat: add KanbanCard component"
```

---

### Task 6: Build ColumnForm Component

**Covers:** S4

**Files:**
- Create: `src/components/kanban/ColumnForm.tsx`

- [ ] **Step 1: Create `src/components/kanban/ColumnForm.tsx`**

```typescript
import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ColumnFormProps {
  onAdd: (name: string) => void
}

export function ColumnForm({ onAdd }: ColumnFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim())
      setName('')
      setIsAdding(false)
    }
  }

  if (!isAdding) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 gap-1.5 border-dashed"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4" />
        Add Column
      </Button>
    )
  }

  return (
    <div className="shrink-0 w-64 rounded-lg border bg-card p-3">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
          if (e.key === 'Escape') {
            setName('')
            setIsAdding(false)
          }
        }}
        placeholder="Column name..."
        className="w-full rounded border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
      />
      <div className="mt-2 flex gap-1.5">
        <Button size="sm" onClick={handleSubmit} disabled={!name.trim()}>
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setName('')
            setIsAdding(false)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/kanban/ColumnForm.tsx
git commit -m "feat: add ColumnForm component"
```

---

### Task 7: Build KanbanColumn Component

**Covers:** S4

**Files:**
- Create: `src/components/kanban/KanbanColumn.tsx`

- [ ] **Step 1: Create `src/components/kanban/KanbanColumn.tsx`**

```typescript
import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MoreHorizontal, Trash2, Pencil, Check, X } from 'lucide-react'
import { KanbanCard } from './KanbanCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Task, KanbanColumn as KanbanColumnType } from '@/types'

interface KanbanColumnProps {
  column: KanbanColumnType
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onUpdateColumn: (id: string, name: string) => void
  onDeleteColumn: (id: string) => void
}

export function KanbanColumnComponent({
  column,
  tasks,
  onEdit,
  onDelete,
  onUpdateColumn,
  onDeleteColumn,
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(column.name)
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateColumn(column.id, editName.trim())
      setIsEditing(false)
    }
  }

  return (
    <div
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg border bg-muted/50',
        isOver && 'border-primary/50 bg-primary/5'
      )}
    >
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-1.5">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') {
                  setEditName(column.name)
                  setIsEditing(false)
                }
              }}
              className="flex-1 rounded border bg-background px-2 py-1 text-sm font-semibold outline-none focus:border-primary"
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => {
                setEditName(column.name)
                setIsEditing(false)
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{column.name}</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                {tasks.length}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive"
                onClick={() => onDeleteColumn(column.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
        style={{ minHeight: 100 }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/kanban/KanbanColumn.tsx
git commit -m "feat: add KanbanColumn component"
```

---

### Task 8: Build KanbanBoard Component

**Covers:** S4, S5

**Files:**
- Create: `src/components/kanban/KanbanBoard.tsx`

- [ ] **Step 1: Create `src/components/kanban/KanbanBoard.tsx`**

```typescript
import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumnComponent } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { ColumnForm } from './ColumnForm'
import { useKanbanStore } from '@/store/kanbanStore'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'

interface KanbanBoardProps {
  onEditTask: (task: Task) => void
}

export function KanbanBoard({ onEditTask }: KanbanBoardProps) {
  const columns = useKanbanStore((s) => s.columns)
  const addColumn = useKanbanStore((s) => s.addColumn)
  const updateColumn = useKanbanStore((s) => s.updateColumn)
  const deleteColumn = useKanbanStore((s) => s.deleteColumn)

  const tasks = useTaskStore((s) => s.tasks)
  const moveTask = useTaskStore((s) => s.moveTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const getTasksByColumn = useCallback(
    (columnId: string) =>
      tasks
        .filter((t) => t.status === columnId)
        .sort((a, b) => a.order - b.order),
    [tasks]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    const overColumn = columns.find((col) => col.id === overId)
    const overTask = tasks.find((t) => t.id === overId)

    if (overColumn) {
      if (activeTask.status !== overColumn.id) {
        moveTask(activeId, overColumn.id, getTasksByColumn(overColumn.id).length)
      }
    } else if (overTask && activeTask.status !== overTask.status) {
      moveTask(activeId, overTask.status, overTask.order)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const columnTasks = getTasksByColumn(activeTask.status)
      const overIndex = columnTasks.findIndex((t) => t.id === overId)
      moveTask(activeId, activeTask.status, overIndex)
    }
  }

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100dvh - 200px)' }}>
        {sortedColumns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onEdit={onEditTask}
            onDelete={deleteTask}
            onUpdateColumn={updateColumn}
            onDeleteColumn={deleteColumn}
          />
        ))}
        <ColumnForm onAdd={addColumn} />
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/kanban/KanbanBoard.tsx
git commit -m "feat: add KanbanBoard with drag-and-drop"
```

---

### Task 9: Update TaskForm with Status Selection

**Covers:** S4

**Files:**
- Modify: `src/components/task/TaskForm.tsx`

- [ ] **Step 1: Add status field to TaskForm**

Add import:
```typescript
import { useKanbanStore } from '@/store/kanbanStore'
```

Add inside component:
```typescript
const columns = useKanbanStore((s) => s.columns)
```

Add status to form state (after existing fields):
```typescript
const [status, setStatus] = useState(task?.status || 'todo')
```

Add to form reset in useEffect:
```typescript
setStatus(task?.status || 'todo')
```

Add status select before the submit button:
```typescript
<div className="space-y-2">
  <Label>Status</Label>
  <Select value={status} onValueChange={setStatus}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {columns.map((col) => (
        <SelectItem key={col.id} value={col.id}>
          {col.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

Update onSubmit to include status:
```typescript
onSubmit({
  title: title.trim(),
  priority,
  categoryId: categoryId || null,
  dueDate: dueDate ? dueDate.toISOString() : null,
  completed: task?.completed ?? false,
  status,
})
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/task/TaskForm.tsx
git commit -m "feat: add status selection to TaskForm"
```

---

### Task 10: Update AppPage

**Covers:** S4, S6

**Files:**
- Modify: `src/pages/AppPage.tsx`

- [ ] **Step 1: Rewrite AppPage to use KanbanBoard**

```typescript
import { useState, useEffect, useRef } from 'react'
import { Plus, ArrowLeft } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { TaskForm } from '@/components/task/TaskForm'
import { CategorySheet } from '@/components/category/CategorySheet'
import { MusicPlayerBar } from '@/components/music/MusicPlayerBar'
import { MusicSearchSheet } from '@/components/music/MusicSearchSheet'
import { TimerWidget } from '@/components/timer/TimerWidget'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/store/settingsStore'
import { useMusicStore } from '@/store/musicStore'
import type { Task } from '@/types'

interface AppPageProps {
  onNavigateHome: () => void
}

export function AppPage({ onNavigateHome }: AppPageProps) {
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)
  const [showWelcomeBadge, setShowWelcomeBadge] = useState(false)
  const hasShownBadge = useRef(false)

  const isSearchOpen = useMusicStore((s) => s.isSearchOpen)
  const toggleSearch = useMusicStore((s) => s.toggleSearch)
  const closeSearch = useMusicStore((s) => s.closeSearch)

  useEffect(() => {
    if (hasShownBadge.current) return
    hasShownBadge.current = true
    queueMicrotask(() => {
      setShowWelcomeBadge(true)
      setTimeout(() => {
        setShowWelcomeBadge(false)
      }, 1200)
    })
  }, [])

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }

  const handleCloseTaskForm = (open: boolean) => {
    if (!open) setEditingTask(undefined)
    setTaskFormOpen(open)
  }

  const handleAddTask = () => {
    setEditingTask(undefined)
    setTaskFormOpen(true)
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </button>
        <span className="text-sm font-semibold text-foreground">Wazheefa</span>
      </div>

      {showWelcomeBadge && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 animate-lp-fade-up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-[13px] font-medium text-foreground">Selamat datang.</span>
            <span className="text-[13px] text-muted-foreground">Mari bereskan yang penting hari ini.</span>
          </div>
        </div>
      )}

      <Layout>
        <Header onCategoryOpen={() => setCategorySheetOpen(true)} onAddTask={handleAddTask} onMusicOpen={toggleSearch} />
        <main className="pt-6">
          <KanbanBoard onEditTask={handleEditTask} />
        </main>
      </Layout>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg shadow-black/10 sm:hidden"
        style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        onClick={handleAddTask}
        aria-label="Tambah tugas"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <TaskForm
        key={editingTask?.id ?? 'new'}
        open={taskFormOpen}
        onOpenChange={handleCloseTaskForm}
        task={editingTask}
      />

      <CategorySheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
      />

      <MusicPlayerBar onOpenSearch={toggleSearch} />
      <MusicSearchSheet open={isSearchOpen} onOpenChange={closeSearch} />
      <TimerWidget />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/AppPage.tsx
git commit -m "feat: update AppPage to use KanbanBoard"
```

---

### Task 11: Remove Hafalan Code

**Covers:** S2

**Files:**
- Remove: `src/components/hafalan/*` (11 files)
- Remove: `src/store/hafalanLogStore.ts`
- Remove: `src/store/hafalanTaskStore.ts`
- Remove: `src/store/santriStore.ts`
- Remove: `src/hooks/useHafalan.ts`

- [ ] **Step 1: Delete all Hafalan components**

```bash
rm -rf src/components/hafalan
```

- [ ] **Step 2: Delete Hafalan stores**

```bash
rm src/store/hafalanLogStore.ts src/store/hafalanTaskStore.ts src/store/santriStore.ts
```

- [ ] **Step 3: Delete Hafalan hooks**

```bash
rm src/hooks/useHafalan.ts
```

- [ ] **Step 4: Type-check to find any remaining references**

```bash
npx tsc --noEmit
```

Fix any errors from missing imports.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove all Hafalan code"
```

---

### Task 12: Update useTasks Hook

**Covers:** S4

**Files:**
- Modify: `src/hooks/useTasks.ts`

- [ ] **Step 1: Update useTasks to work with Kanban**

Remove or simplify the hook since KanbanBoard handles filtering by column. Keep search functionality if needed.

```typescript
import { useState, useMemo } from 'react'
import { useTaskStore } from '@/store/taskStore'

export function useTasks() {
  const tasks = useTaskStore((s) => s.tasks)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const toggleTask = useTaskStore((s) => s.toggleTask)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks
    const query = searchQuery.toLowerCase()
    return tasks.filter((t) => t.title.toLowerCase().includes(query))
  }, [tasks, searchQuery])

  return {
    tasks: filteredTasks,
    searchQuery,
    setSearchQuery,
    deleteTask,
    toggleTask,
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTasks.ts
git commit -m "refactor: simplify useTasks for Kanban"
```

---

### Task 13: Update Migration

**Covers:** S3

**Files:**
- Modify: `src/lib/migrate.ts`

- [ ] **Step 1: Add migration for tasks without status field**

```typescript
export function migrateTaskStatus() {
  try {
    const stored = localStorage.getItem('wazheefa-tasks')
    if (!stored) return

    const data = JSON.parse(stored)
    if (!data.state?.tasks) return

    let needsUpdate = false
    const migrated = data.state.tasks.map((task: Record<string, unknown>) => {
      if (!task.status) {
        needsUpdate = true
        return { ...task, status: task.completed ? 'done' : 'todo' }
      }
      return task
    })

    if (needsUpdate) {
      data.state.tasks = migrated
      localStorage.setItem('wazheefa-tasks', JSON.stringify(data))
    }
  } catch {
    console.warn('[migrate] Failed to migrate task status')
  }
}
```

- [ ] **Step 2: Call migration in main.tsx**

Add to `src/main.tsx`:
```typescript
import { migrateTaskStatus } from '@/lib/migrate'

migrateTaskStatus()
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/migrate.ts src/main.tsx
git commit -m "feat: add migration for task status field"
```

---

### Task 14: Update Landing Page

**Covers:** S8

**Files:**
- Modify: `src/components/landing/LandingHero.tsx`
- Modify: `src/components/landing/LandingShowcase.tsx`

- [ ] **Step 1: Update LandingShowcase to show Kanban board**

Update the showcase section to display a Kanban board mockup instead of the list view.

- [ ] **Step 2: Update LandingHero copy**

Update any references to "tasks" or "lists" to reflect Kanban workflow.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/
git commit -m "feat: update landing page for Kanban"
```

---

### Task 15: Final Cleanup and Testing

**Covers:** S2, S6

- [ ] **Step 1: Run full type-check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 2: Run linter**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 3: Run dev server and test manually**

```bash
npm run dev
```

Test:
1. Board loads with 4 default columns
2. Can add new task via + button
3. Can drag tasks between columns
4. Can add new column
5. Can rename column
6. Can delete column
7. Mobile: swipeable columns work
8. Existing tasks migrated with correct status

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: Successful build

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Kanban overhaul"
```
