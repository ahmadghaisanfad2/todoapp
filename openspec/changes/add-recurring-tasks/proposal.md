## Why

Wazheefa users currently have to manually re-create repeating tasks (e.g. "gym every Monday", "pay rent monthly"). There is no way to express task recurrence, so habitual and scheduled work silently falls off the list or requires tedious manual duplication.

## What Changes

- Add an optional recurrence rule to tasks: none, daily, weekly, monthly (on the task's due date), each with optional interval (every N days/weeks/months)
- When a recurring task is completed, automatically generate the next occurrence based on the rule and interval, carrying over the title, category, priority, and notes
- Show a recurrence badge (e.g. 🔁) on task cards for recurring tasks, with the rule visible in the task form
- Expose the recurrence rule in the task form as an optional select with an interval stepper
- The generated next occurrence starts as incomplete with a fresh `createdAt`; the completed instance keeps its history (undo stack unaffected, since generation happens in the store action)
- **BREAKING**: none — existing persisted tasks without a recurrence field continue to behave exactly as today

## Capabilities

### New Capabilities
- `task-recurrence`: Defines the recurrence model (rule + interval), how next occurrences are generated on completion, and how recurrence is surfaced in the UI (task form control, card badge, filtering).

### Modified Capabilities
- (none — no existing specs yet; this is the first spec for the repo)

## Impact

- `src/types/index.ts` — `Task` gains optional `recurrence?: { rule: 'daily' | 'weekly' | 'monthly'; interval: number }`
- `src/store/taskStore.ts` — `toggleTask` gains recurrence-aware next-occurrence generation; `addTask`/`updateTask` accept the recurrence field
- `src/components/task/TaskForm.tsx` — new recurrence select + interval input
- `src/components/task/TaskCard.tsx` — recurrence badge
- `src/hooks/useTasks.ts` — no change required (badge/filtering only)
- `src/lib/migrate.ts` — safe no-op (recurrence optional, `undefined` for existing tasks)
- Tests: extend `tests/run.mjs` suites with a recurrence-generation scenario
