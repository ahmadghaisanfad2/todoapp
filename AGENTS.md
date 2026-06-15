# AGENTS.md — Wazheefa

Guidelines for AI coding agents working in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, http://localhost:5173)
npm run build      # Type-check (tsc -b) then production build (vite build)
npm run lint       # ESLint across all .ts/.tsx files
npm run preview    # Preview production build locally
npm run test       # Run the Node-based UI regression suite
npm run test:smoke # Run the smoke subset of the regression suite
npx tsc --noEmit   # Type-check only (no emit)
```

The test runner is a Node-based harness in `tests/run.mjs`. Playwright is used by that harness for UI regression coverage and manual QA. Tests expect the dev server running at `http://localhost:5173` (override with `BASE_URL` env var).

Run a single test suite: `node tests/run.mjs <filter>` (substring match on filename, e.g., `node tests/run.mjs smoke`).

## Project Structure

```
src/
├── index.css                      # Tailwind + CSS custom properties (light/dark themes)
├── main.tsx                       # React 19 bootstrap + minimal pathname router (`/` and `/app`)
├── pages/
│   ├── LandingPage.tsx            # Marketing landing page (`/`)
│   └── AppPage.tsx                # Main task app (`/app`)
├── types/
│   └── index.ts                   # Shared interfaces (Task, Category, AppSettings, KanbanColumn)
├── lib/
│   ├── utils.ts                   # cn(), generateId(), formatTime()
│   ├── safeStorage.ts             # try/catch localStorage adapter for Zustand persist
│   ├── constants.ts               # STORAGE_KEYS, DEFAULT_COLUMNS
│   ├── migrate.ts                 # One-time localStorage migration (todoflow → wazheefa)
│   └── musicPresets.ts            # Preset lofi YouTube tracks
├── store/                         # Zustand stores (5 total, all persisted to localStorage)
│   ├── taskStore.ts               # wazheefa-tasks
│   ├── categoryStore.ts           # wazheefa-categories
│   ├── settingsStore.ts           # wazheefa-settings
│   ├── kanbanStore.ts             # wazheefa-kanban
│   └── musicStore.ts              # wazheefa-music
├── hooks/                         # Custom hooks (bridge stores → components)
│   ├── useTasks.ts
│   ├── useCategories.ts
│   ├── useTheme.ts
│   ├── useTimer.ts
│   └── useYouTubePlayer.ts
├── components/
│   ├── ui/                        # shadcn/ui primitives — DO NOT edit manually
│   ├── common/                    # EmptyState, Logo, PriorityBadge, ErrorBoundary
│   ├── layout/                    # Header, Layout
│   ├── landing/                   # LandingNav, LandingHero
│   ├── task/                      # TaskCard, TaskFilter, TaskForm, TaskList
│   ├── category/                  # CategorySheet, CategoryForm
│   ├── kanban/                    # KanbanBoard, KanbanCard, KanbanColumn, ColumnForm
│   ├── timer/                     # TimerWidget, TimerSetup, TimerRunning, TimerComplete
│   └── music/                     # MusicPlayerBar, MusicSearchSheet
```

## Path Aliases

`@` resolves to `./src` (configured in both vite.config.ts and tsconfig.app.json).

```typescript
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
```

## TypeScript

- **Strict mode** enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **`verbatimModuleSyntax: true`** — use `import type` for type-only imports
- **`erasableSyntaxOnly: true`** — no `enum`, `namespace`, or other non-erasable syntax
- Target: ES2023, JSX: react-jsx
- Never use `as any`, `@ts-ignore`, or `@ts-expect-error`
- No enums — use union types: `'high' | 'medium' | 'low'`
- Derive narrow types from interfaces: `export type Priority = Task['priority']`

## Import Order

1. React imports (`react`, `react-dom`)
2. Third-party libraries (`date-fns`, `lucide-react`, `zustand`)
3. Local UI components (`@/components/ui/...`)
4. Local app components and hooks (`@/components/...`, `@/hooks/...`, `@/store/...`)
5. Utilities (`@/lib/utils`, `@/lib/constants`, `@/lib/migrate`)
6. Type-only imports last or inline with `import type`

```typescript
import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/store/taskStore'
import { cn } from '@/lib/utils'
import type { Task, Priority } from '@/types'
```

## Component Conventions

- **Named exports** for all components: `export function TaskCard() {}`
- **Props**: Define a `[Component]Props` interface directly above the component
- **Function declarations**, not arrow functions, for components
- File names: **PascalCase** for components (`TaskCard.tsx`), **camelCase** for everything else (`taskStore.ts`, `useTasks.ts`)

```typescript
interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  // ...
}
```

## State Management (Zustand)

All stores use `create` with `persist` middleware wrapping a shared `safeStorage` adapter from `lib/safeStorage.ts` (try/catch on localStorage reads/writes). Each store has a typed interface.

```typescript
interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void
  // ...
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({ /* state + actions */ }),
    { name: 'wazheefa-tasks' }
  )
)
```

**Selectors**: Always use individual selectors to avoid unnecessary re-renders:

```typescript
const tasks = useTaskStore((s) => s.tasks)
const addTask = useTaskStore((s) => s.addTask)
```

## Custom Hooks

- Named `use[Domain]` (e.g., `useTasks`, `useCategories`, `useTheme`)
- Export as named function declarations
- Return plain objects with state and actions
- Use `useMemo` for derived/filtered data

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **shadcn/ui** components in `src/components/ui/` — do NOT edit these manually; use `npx shadcn@latest add <component>`
- **`cn()` utility** for conditional classes: `cn('base-class', condition && 'conditional-class')`
- CSS custom properties for theming in `index.css` (HSL values for light/dark)
- Dark mode: class-based (`.dark` on `<html>`)
- Landing page motion is implemented with CSS keyframes/utilities in `index.css`; keep transitions subtle and lightweight
- Use `text-muted-foreground`, `bg-card`, `border`, etc. — semantic color tokens, not raw colors

```typescript
className={cn(
  'flex items-start gap-3 rounded-lg border bg-card px-3 py-3',
  task.completed && 'opacity-60',
  overdue && 'border-red-300 dark:border-red-800'
)}
```

## Types

All shared types live in `src/types/index.ts`. Keep domain types there. Component-specific props interfaces stay colocated with their component.

- Interfaces for object shapes: `interface Task { ... }`
- Union types over enums: `'high' | 'medium' | 'low'`
- Derived types: `type Priority = Task['priority']`
- Nullable fields use `string | null`, not optional (`?`)

## Error Handling

- Form validation: guard with early returns (`if (!title.trim()) return`)
- Stores use try/catch in the shared `safeStorage` adapter; hooks and components do not catch
- `ErrorBoundary` component wraps the router to prevent white-screen crashes

## Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI framework |
| Zustand | 5.x | State management with localStorage persist |
| Tailwind CSS | 4.x | Utility-first styling (Vite plugin) |
| shadcn/ui | latest | Radix-based component primitives |
| date-fns | 4.x | Date formatting and comparison |
| lucide-react | 1.x | Icons |

## Routing

- The app uses a minimal pathname-based router in `src/main.tsx`
- `/` renders the marketing landing page
- `/app` renders the main task application
- Keep new navigation changes lightweight unless there is a clear need to introduce a routing library

## Do NOT

- Edit files in `src/components/ui/` manually
- Use `as any` or type assertions to silence errors
- Use enums — use union string literals
- Add dependencies without checking if an existing one covers the need
- Skip `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
