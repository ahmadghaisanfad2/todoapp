# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Wazheefa** is a modern productivity app inspired by Next.js, JetBrains, and Apple design — combining desktop-grade utility with premium visual polish. Clean surfaces, strong hierarchy, and elegant simplicity.

**Key Concept**: Calm, minimal UI with focused productivity and refined interaction design.

## Repository

- **URL**: https://github.com/ahmadghaisanfad2/todoapp

## Quick Commands

```bash
npm run dev        # Start dev server (Vite, http://localhost:5173)
npm run build      # Type-check (tsc -b) + production build (vite build)
npm run lint       # ESLint flat config across all .ts/.tsx files
npm run preview    # Preview production build locally
npm run test       # Run all Playwright-based UI regression tests
npm run test:smoke # Run the smoke subset only
npx tsc --noEmit   # Type-check only (no emit)
```

### Running a single test

```bash
node tests/run.mjs smoke        # Runs only test files matching "smoke"
node tests/run.mjs task-crud    # Runs only test files matching "task-crud"
```

## Architecture

### Routing

The app uses a **minimal pathname-based router** in `src/main.tsx` — no React Router or TanStack Router. A `Router` component reads `window.location.pathname` and listens for `popstate`:

- `/` → `LandingPage` (marketing)
- `/app` → `AppPage` (main task + hafalan app)

Navigation uses `window.history.pushState({}, '', to)` + `setPath`. Keep this lightweight — don't introduce a routing library without clear need.

### Two Domains: Tasks + Hafalan

The app has two independent feature modules, switched via a tab bar in `AppPage`:

**Tasks** (original module) — task management with categories, priorities, due dates, filters, and search.

**Hafalan** (memorization tracking) — a Quran/study memorization tracker for managing santri (students) and their memorization tasks. Added in `d24ccbe`.

### Hafalan Domain Model

The hafalan module tracks students memorizing assigned passages:

- **HafalanTask** — a memorization passage/target (e.g., "Surah Al-Fatihah"). Can be `personalFor: null` (shared to all santri) or `personalFor: santriId` (assigned to one student).
- **Santri** — a student with a list of `targetTaskIds` they're working on. When a new santri is created, they auto-inherit all shared (`personalFor: null`) tasks.
- **HafalanLog** — a single memorization event/attempt with type `setor` (recitation to teacher), `murajaah` (review), or `ziyadah` (new memorization). A task is considered "completed" for a santri when they have at least one `setor` log.

Stores: `hafalanTaskStore`, `santriStore`, `hafalanLogStore` — all follow the same Zustand + persist + safeStorage pattern as the task stores.

Hook: `useHafalan()` in `src/hooks/useHafalan.ts` bridges all three stores with derived data — progress calculations, task status per santri, and cross-store cascade deletes (deleting a hafalan task removes it from all santri and deletes related logs).

### State Management (Zustand)

All stores use `create` with `persist` middleware wrapping a `safeStorage` adapter (try/catch on localStorage reads/writes). Each store has a typed interface. There are **six stores** total:

| Store | Storage Key | Purpose |
|-------|-------------|---------|
| `taskStore` | `wazheefa-tasks` | CRUD for tasks |
| `categoryStore` | `wazheefa-categories` | CRUD for categories |
| `settingsStore` | `wazheefa-settings` | Theme, sort, filter preferences |
| `hafalanTaskStore` | `wazheefa-hafalan-tasks` | CRUD for memorization tasks |
| `santriStore` | `wazheefa-santri` | CRUD for students |
| `hafalanLogStore` | `wazheefa-hafalan-logs` | Memorization event logs with query methods |

**Selectors**: Always use individual selectors to avoid unnecessary re-renders:
```typescript
const tasks = useTaskStore((s) => s.tasks)
const addTask = useTaskStore((s) => s.addTask)
```

The `useHafalan` hook is an exception — it uses `setState` directly for cross-store cascade operations (e.g., deleting a task cascades to santri targetTaskIds and logs).

### Custom Hooks Layer

Hooks in `src/hooks/` bridge stores to components, providing derived data and composed actions:

- `useTasks()` — filtering, sorting, search, overdue detection
- `useCategories()` — CRUD + lookup helpers
- `useTheme()` — theme application with `prefers-color-scheme` media query listener for `system` mode
- `useHafalan()` — progress computation, task status, cascade deletes, santri-task cross-references

### Test Runner Architecture

Tests use **Playwright (core)** directly — no `@playwright/test`. A custom Node-based runner in `tests/run.mjs`:

1. Launches Chromium headless
2. Discovers all `*.test.mjs` files in `tests/`
3. Imports each file's default export (an async function)
4. Each test file receives `{ page, context, browser, test, assert, BASE_URL }`
5. Uses Node's built-in `assert/strict` for assertions
6. The `test(name, fn)` helper registers named tests; the runner executes them sequentially and reports pass/fail

Tests expect the dev server to be running at `BASE_URL` (default `http://localhost:5173`). Set `BASE_URL` env var to override.

### ESLint

Flat config (`eslint.config.js`) with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins. The `dist/` directory and `src/components/ui/` (shadcn components) are globally ignored.

## Important Conventions

See `AGENTS.md` for comprehensive coding guidelines. Key points:

### TypeScript
- Strict mode enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`)
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- No enums — use union types: `'high' | 'medium' | 'low'`
- Derive narrow types from interfaces: `export type Priority = Task['priority']`
- Never use `as any`, `@ts-ignore`, or `@ts-expect-error`

### Components
- Named exports (except App.tsx uses default)
- Function declarations, not arrow functions
- Props interfaces above components: `interface TaskCardProps { ... }`
- File names: PascalCase for components, camelCase for everything else

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Semantic color tokens (`text-muted-foreground`, `bg-card`, `border`, etc.) — use these, not raw colors
- Use `cn()` utility for conditional classes: `cn('base', condition && 'conditional')`
- CSS custom properties for theming in `index.css` (HSL values for light/dark)
- Dark mode: class-based (`.dark` on `<html>`), with `system` option following OS preference
- shadcn/ui components in `src/components/ui/` — do NOT edit these manually

### Import Order
1. React imports (`react`, `react-dom`)
2. Third-party libraries (`date-fns`, `lucide-react`, `zustand`)
3. Local UI components (`@/components/ui/...`)
4. Local app components and hooks (`@/components/...`, `@/hooks/...`, `@/store/...`)
5. Utilities (`@/lib/utils`, `@/lib/constants`, `@/lib/migrate`)
6. Type-only imports last or inline with `import type`

### Path Aliases
`@` resolves to `./src` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Branding

- App name: **Wazheefa**
- Storage keys: `wazheefa-tasks`, `wazheefa-categories`, `wazheefa-settings`, `wazheefa-hafalan-tasks`, `wazheefa-santri`, `wazheefa-hafalan-logs`
- Old keys (`todoflow-*`) are migrated automatically on first load via `src/lib/migrate.ts`

## Code Review

When reviewing PRs, check for:
1. CLAUDE.md and AGENTS.md compliance
2. TypeScript strict mode adherence
3. Proper import ordering
4. Individual Zustand selectors (not destructuring entire store)
5. Consistent use of union types over enums
6. No manual edits to shadcn/ui components in `src/components/ui/`
