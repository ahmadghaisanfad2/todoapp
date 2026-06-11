# Wazheefa Kanban Overhaul Design

## [S1] Problem

The current Wazheefa app is a list-based task manager with a Hafalan (Quran memorization) feature. The user wants to transform it into a Kanban board for better task tracking and workflow visualization, while removing the Hafalan feature to focus solely on task management.

## [S2] Solution Overview

Transform the app into a Kanban board with:
- **4 default columns:** Backlog, To Do, In Progress, Done
- **Custom columns:** Users can add, rename, and reorder columns
- **Drag-and-drop:** Move cards between columns using @dnd-kit
- **Task cards:** Show title, priority badge, and due date
- **Mobile:** Swipeable columns (one visible at a time)
- **Remove Hafalan:** Delete all Hafalan code, stores, components, and types
- **Keep existing features:** Categories, priorities, due dates, search, filters

## [S3] Data Model

### Task Interface Changes

```typescript
interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  categoryId: string | null
  dueDate: string | null
  status: string // column ID (default: 'todo')
  createdAt: string
  updatedAt: string
  order: number // order within column
}
```

### New KanbanColumn Interface

```typescript
interface KanbanColumn {
  id: string
  name: string
  order: number
}
```

### New kanbanStore

```typescript
interface KanbanStore {
  columns: KanbanColumn[]
  addColumn: (name: string) => void
  updateColumn: (id: string, updates: Partial<KanbanColumn>) => void
  deleteColumn: (id: string) => void
  reorderColumns: (columns: KanbanColumn[]) => void
}
```

Default columns: `backlog`, `todo`, `inprogress`, `done`

### Migration

Existing tasks without `status` field default to `'todo'`.

## [S4] Components

### New Components

- `KanbanBoard` — main board container with horizontal scroll
- `KanbanColumn` — single column with header, card list, drop zone
- `KanbanCard` — draggable task card with title, priority, due date
- `ColumnForm` — inline add/rename column input

### Updated Components

- `AppPage` — remove Hafalan tab, use KanbanBoard instead of TaskList
- `TaskForm` — add status/column selection field
- `TaskCard` — adapt for Kanban display (compact)

### Removed Components

- All `hafalan/` components (11 files)
- All hafalan stores (3 files)
- All hafalan hooks
- All hafalan types

## [S5] Drag-and-Drop

Using `@dnd-kit/core` and `@dnd-kit/sortable`:

- `DndContext` wraps the KanbanBoard
- `SortableContext` for each column's card list
- `useSortable` on each KanbanCard
- `useDroppable` on each KanbanColumn
- Handle `onDragEnd` to update task status and order

## [S6] Mobile Experience

- Single column visible at a time on mobile (< 640px)
- Swipe left/right to navigate between columns
- Column indicator dots at bottom
- Desktop: all columns visible with horizontal scroll

## [S7] Existing Features

Keep all existing functionality:
- Categories (with category management)
- Priority levels (high/medium/low)
- Due dates
- Search
- Filters (status, priority, category)
- Music player (keep as-is)
- Timer widget (keep as-is)

## [S8] Landing Page

Update landing page hero and feature sections to showcase:
- Kanban board mockup instead of list view
- Updated copy about workflow management
- Keep same structure and style

## [S9] File Changes Summary

### New Files
- `src/store/kanbanStore.ts`
- `src/components/kanban/KanbanBoard.tsx`
- `src/components/kanban/KanbanColumn.tsx`
- `src/components/kanban/KanbanCard.tsx`
- `src/components/kanban/ColumnForm.tsx`

### Modified Files
- `src/types/index.ts` — add status to Task, add KanbanColumn
- `src/store/taskStore.ts` — update for status field
- `src/pages/AppPage.tsx` — remove Hafalan tab, use KanbanBoard
- `src/components/task/TaskForm.tsx` — add status selection
- `src/components/landing/*` — update visuals
- `src/index.css` — Kanban-specific styles
- `package.json` — add @dnd-kit dependencies

### Removed Files
- `src/components/hafalan/*` (11 files)
- `src/store/hafalanLogStore.ts`
- `src/store/hafalanTaskStore.ts`
- `src/store/santriStore.ts`
- `src/hooks/useHafalan.ts`
- `src/types/hafalan.ts`

## [S10] Implementation Order

1. Install @dnd-kit dependencies
2. Create kanbanStore with column management
3. Update Task type with status field
4. Add migration for existing tasks
5. Build KanbanBoard, KanbanColumn, KanbanCard components
6. Update AppPage to use KanbanBoard
7. Update TaskForm with status selection
8. Remove all Hafalan code
9. Update landing page visuals
10. Test drag-and-drop, mobile swipe, column management
