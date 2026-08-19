# Design: Add Recurring Tasks

## Context

See proposal.md — Why. Wazheefa is a React 19 + Zustand 5 app with tasks persisted to localStorage via a shared `safeStorage` adapter. `Task` lives in `src/types/index.ts`; completion toggling happens in `taskStore.toggleTask`. Existing tasks have no recurrence concept.

## Goals / Non-Goals

**Goals**
- Optional recurrence on tasks with zero impact on existing persisted data
- Next-occurrence generation as a pure, testable function
- Recurrence editable in the existing task form and visible on cards

**Non-Goals**
- Skipping occurrences (e.g. "not this week") or pause/resume of recurrence
- Recurrence on completion *of a late occurrence* (catch-up semantics)
- Custom cron-like rules (e.g. "every 2nd Tuesday") — rule + interval covers the 95% case; extendable later

## Decisions

**D1: Store recurrence as a single optional field on `Task`**
`recurrence?: { rule: 'daily' | 'weekly' | 'monthly'; interval: number }`
- Why: one field, one zod-free shape, trivially optional → no migration needed; `undefined` == one-off
- Alternative considered: separate `recurrenceStore` — rejected, splits task data across stores for no benefit

**D2: Generate next occurrence inside `toggleTask` when a recurring task flips to completed**
- Why: completion is the only trigger in the spec; keeping generation in the store action keeps the undo stack (in-memory, `undoStore`) consistent — undo of a completion can also remove the generated occurrence by id
- Alternative: an effect watching `tasks` — rejected, effects run late and are harder to test

**D3: Pure `computeNextDueDate(dueDate, rule, interval)` helper in `src/lib/recurrence.ts`**
- Why: spec requires valid dates across month boundaries (Jan 31 → Feb 28/29). A pure helper with `date-fns` (`addDays`, `addWeeks`, `addMonths` + clamp to last valid day) is unit-testable without a UI
- Alternative: naive `addMonths` without clamping — rejected, produces invalid dates like Feb 31

**D4: Badge only (no recurrence filter) in v1**
- Why: spec only requires visibility; filters/kanban support can be follow-ups

## Risks / Trade-offs

- [Month-boundary dates drift over time (Jan 31 → Feb 28 → Mar 28)] → clamp to last valid day of month keeps dates valid; drift is acceptable for v1 and documented in code
- [User edits a recurring task's due date] → next occurrence always derives from the *completed* task's due date, so edits are honored on the next cycle
- [Undo of a completed recurring task] → `undoStore` removes the generated occurrence by id in the same action; verify in tests
- [Recurrence + kanban manual drag] → generated occurrence lands in the default column, same as new tasks today

## Migration Plan

- No data migration: `recurrence` is optional; existing localStorage payloads are untouched (`migrate.ts` stays a no-op for this field)
- Rollback: revert store/form changes; `recurrence` field becomes inert in persisted data

## Open Questions

- None blocking; recurrence filters and catch-up semantics are deferred features, not spec changes.
