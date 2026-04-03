# AGENTS.md — Wazheefa

Guidelines for AI coding agents working in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, http://localhost:5173)
npm run build      # Type-check (tsc -b) then production build (vite build)
npm run lint       # ESLint across all .ts/.tsx files
npm run preview    # Preview production build locally
npx tsc --noEmit   # Type-check only (no emit)
```

No test runner is configured. Playwright is a devDependency for manual QA only.

## Project Structure

```
src/
├── App.tsx                        # Root component (default export)
├── index.css                      # Tailwind + CSS custom properties (light/dark themes)
├── main.tsx                       # React 19 bootstrap (StrictMode, createRoot)
├── types/index.ts                 # All shared interfaces and type aliases
├── lib/
│   ├── utils.ts                   # cn() — Tailwind class merge utility
│   ├── uuid.ts                    # generateId() via crypto.randomUUID()
│   ├── constants.ts               # Storage keys and app colors
│   └── migrate.ts                 # One-time localStorage migration (todoflow → wazheefa)
├── store/                         # Zustand stores (persisted to localStorage)
│   ├── taskStore.ts
│   ├── categoryStore.ts
│   └── settingsStore.ts
├── hooks/                         # Custom hooks (bridge stores → components)
│   ├── useTasks.ts
│   ├── useCategories.ts
│   └── useTheme.ts
├── components/
│   ├── ui/                        # shadcn/ui primitives — DO NOT edit manually
│   ├── common/                     # Shared components (EmptyState, PriorityBadge, ThemeProvider)
│   ├── layout/                     # Header, Layout
│   ├── task/                       # TaskCard, TaskFilter, TaskForm, TaskList
│   └── category/                   # CategorySheet, CategoryForm
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
- Target: ES2023, JSX: react-jsx
- Never use `as any`, `@ts-ignore`, or `@ts-expect-error`
- No enums — use union types: `'high' | 'medium' | 'low'`
- Derive narrow types from interfaces: `export type Priority = Task['priority']`

## Import Order

1. React imports (`react`, `react-dom`)
2. Third-party libraries (`date-fns`, `lucide-react`, `zustand`)
3. Local UI components (`@/components/ui/...`)
4. Local app components and hooks (`@/components/...`, `@/hooks/...`, `@/store/...`)
5. Utilities (`@/lib/utils`, `@/lib/uuid`, `@/lib/constants`, `@/lib/migrate`)
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
- **Exception**: `App.tsx` uses `export default function App()`
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

All stores use `create` with `persist` middleware for localStorage. Each store has a typed interface.

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
- No try/catch in the current codebase — stores and hooks assume localStorage is available
- No error boundaries yet

## Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI framework |
| Zustand | 5.x | State management with localStorage persist |
| Tailwind CSS | 4.x | Utility-first styling (Vite plugin) |
| shadcn/ui | latest | Radix-based component primitives |
| date-fns | 4.x | Date formatting and comparison |
| lucide-react | 1.x | Icons |
| vite-plugin-pwa | 1.x | PWA service worker + manifest |

## PWA

Configured in `vite.config.ts` via `VitePWA`. Auto-updates service worker. Workbox caches `**/*.{js,css,html,ico,png,svg}`. Manifest defines app name, theme color (#2563EB), and icons.

## Do NOT

- Edit files in `src/components/ui/` manually
- Use `as any` or type assertions to silence errors
- Use enums — use union string literals
- Add dependencies without checking if an existing one covers the need
- Skip `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
