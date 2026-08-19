# Tasks: Add Recurring Tasks

## 1. Types & Data Model

- [ ] 1.1 Add `RecurrenceRule` type (`'daily' | 'weekly' | 'monthly'`) and `Task['recurrence']?: { rule: RecurrenceRule; interval: number }` to `src/types/index.ts`
- [ ] 1.2 Verify `migrate.ts` stays a safe no-op for tasks without `recurrence` (optional field, no version bump needed)

## 2. Recurrence Engine

- [ ] 2.1 Create `src/lib/recurrence.ts` with pure `computeNextDueDate(dueDate: string, rule: RecurrenceRule, interval: number): string` using date-fns (`addDays`/`addWeeks`/`addMonths`), clamping monthly dates to the last valid day of the target month
- [ ] 2.2 Create `src/lib/recurrence.test.ts` (or equivalent unit test wired into the existing harness) covering: daily advance, weekly advance, monthly across month boundaries (Jan 31 → Feb 28/29), interval > 1

## 3. Store Integration

- [ ] 3.1 Extend `taskStore` `addTask`/`updateTask` signatures to accept optional `recurrence`
- [ ] 3.2 In `toggleTask`, when a task flips to completed AND has a recurrence, generate the next occurrence (inherit title/category/priority/notes, fresh `createdAt`/`id`, due date via `computeNextDueDate`, incomplete) and append it
- [ ] 3.3 Ensure the undo action (`undoStore`) removes the generated occurrence by id when undoing that completion — add regression coverage
- [ ] 3.4 Add store-level test scenario to the regression suite: complete weekly task → new incomplete occurrence with advanced due date appears; completed task stays completed

## 4. UI

- [ ] 4.1 Add recurrence select (none/daily/weekly/monthly) + interval input to `TaskForm.tsx`, with validation rejecting interval < 1 (spec: Invalid interval rejected)
- [ ] 4.2 Show a recurrence indicator (e.g. Repeat icon from lucide-react) on `TaskCard.tsx` when `task.recurrence` is set (spec: Recurrence badge shown)
- [ ] 4.3 Show recurrence state when editing an existing recurring task (prefill form from `task.recurrence`)

## 5. Verification

- [ ] 5.1 Run `npx tsc --noEmit` — zero errors
- [ ] 5.2 Run `npm run lint` — zero errors
- [ ] 5.3 Run full regression suite (`node tests/run.mjs` against dev server on :5173) — all pass
- [ ] 5.4 Manual QA: create recurring weekly task, complete it, confirm next occurrence appears with correct due date and badge; undo completion removes it
