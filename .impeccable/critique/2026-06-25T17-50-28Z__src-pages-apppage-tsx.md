---
target: /app
total_score: 23
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-06-25T17-50-28Z
slug: src-pages-apppage-tsx
---
# Critique: `/app` (Wazheefa task shell)

**Target:** `src/pages/AppPage.tsx` and composed app surfaces (kanban, header, timer, music, workspace)
**Date:** 2026-06-25
**Viewed at:** http://localhost:5174/app (light + dark, desktop + 390px mobile)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Timer and welcome states communicate well; crossTasks toggle and kanban progress bar meaning are opaque |
| 2 | Match System / Real World | 2 | Indonesian welcome copy vs English chrome; Strikethrough icon for "cross completed tasks" is non-obvious |
| 3 | User Control and Freedom | 3 | Undo (⌘Z), workspace delete confirmation, drag-cancel; task delete is one-click with no confirm |
| 4 | Consistency and Standards | 2 | Two stacked nav bars both show "Wazheefa"; typography doesn't match DESIGN.md brand split (Inter-only h1) |
| 5 | Error Prevention | 2 | Workspace delete guarded; column delete moves tasks; kanban card delete and column delete lack friction |
| 6 | Recognition Rather Than Recall | 2 | Desktop labels help; mobile header is icon-only; empty board offers no "start here" guidance |
| 7 | Flexibility and Efficiency | 2 | Hidden undo shortcut, DnD keyboard sensor; no surfaced shortcuts or quick-capture |
| 8 | Aesthetic and Minimalist Design | 2 | Competent shadcn craft undermined by duplicate chrome and bottom-right FAB competition |
| 9 | Error Recovery | 3 | Undo toast recovers deletes; undiscoverable without accident or docs |
| 10 | Help and Documentation | 2 | Timer tooltip only; no guidance for workspaces, categories, or empty kanban |
| **Total** | | **23/40** | **Acceptable — significant polish needed before it feels Linear-trustworthy** |

## Anti-Patterns Verdict

**LLM assessment:** `/app` does not scream "AI landing page." Dark mode reads as a credible productivity tool — restrained emerald, flat kanban, familiar patterns. The slop tells are subtler: warm cream body in light mode (conflicts with your own PRODUCT.md anti-reference), **assembled chrome** (two headers, brand repeated three times), and **focus tools fighting for the same corner** (timer FAB + mobile add FAB). It passes the category reflex test better than the landing, but a Linear-fluent user would pause at the stacked nav and cryptic column icons.

**Deterministic scan (CLI):** Clean — `detect.mjs` returned 0 findings across app source files.

**Browser scan (injected `detect.js` on live `/app`):** 6 runtime findings:
- `skipped-heading` — `<h1>Wazheefa</h1>` then column `<h3>Backlog</h3>` (missing h2)
- `overused-font` / `single-font` — Inter dominates rendered text (Syne unused in app shell)
- `gradient-text` (×2) — `background-clip: text` detected in DOM (likely global CSS bleed; not visible as hero gradient text in app)
- `bounce-easing` — `animate-bounce` present in stylesheet
- `ai-color-palette` — flagged cyan-on-dark (likely false positive from dev tooling / SVG; not a visible brand issue)

**Visual inspection:** Screenshots confirm double header, empty kanban with four bare columns, timer tooltip overlapping bottom-right real estate, and "Done" column clipped until horizontal scroll.

## Overall Impression

The bones are good — kanban DnD, workspace scoping, timer/music as focus aids align with PRODUCT.md. What's holding it back is **navigation redundancy** and **unclear first-run path**: a creator opening `/app` for a focus session sees an empty board and duplicated branding before they can do anything meaningful. Fix the chrome, resolve mobile FAB collision, and add a board-level empty state — then this earns trust.

## What's Working

1. **Kanban as primary surface** — Tasks live where users work. Column drop targets highlight (`border-primary/50`), drag overlay is clean, overdue cards get red border without side-stripe bans.
2. **Focus aids are optional, not modal** — Timer FAB and music bar stay peripheral; music bar hides until a track is selected. Aligns with "focus is the product."
3. **Undo infrastructure** — `useUndoKeyboard` + `UndoToast` is the right power-user escape hatch; workspace delete uses a proper confirmation dialog.

## Priority Issues

### [P1] Duplicate navigation chrome
- **What:** `AppPage` renders a 56px sub-bar (back, workspace, centered "Wazheefa") *above* `Header` (logo + h1 "Wazheefa" + tagline + 4 actions). Brand appears three times before the board.
- **Why it matters:** Violates "quiet confidence" and product register density rules. Creators lose vertical space and mental model clarity — which bar is "home"?
- **Fix:** Merge into one app shell: workspace switcher + actions in a single 56–64px bar. Drop the centered wordmark or the duplicate h1.
- **Suggested command:** `/impeccable distill /app`

### [P1] Mobile FAB collision (timer vs add task)
- **What:** `TimerWidget` and `AppPage` mobile FAB both use `fixed bottom-6 right-6 z-[60]`.
- **Why it matters:** On mobile, primary capture and focus timer compete for the same thumb target. Casey abandons or mis-taps.
- **Fix:** Single FAB cluster or relocate add-task to bottom-left / inline in first column. Stack with safe-area offset when music bar is visible.
- **Suggested command:** `/impeccable layout /app`

### [P1] Language split undermines trust
- **What:** Welcome badge is Indonesian ("Selamat datang"); FAB aria-label is Indonesian ("Tambah tugas"); rest of UI is English (Add task, Categories, Stay focused…).
- **Why it matters:** Landing is Indonesian-first; app feels unfinished or auto-translated. Jordan assumes they're in the wrong locale.
- **Fix:** Pick one register language for `/app` (likely Indonesian to match landing) or English throughout. PRODUCT.md doesn't mandate either — but mixing is worse than either alone.
- **Suggested command:** `/impeccable clarify /app`

### [P2] Empty board doesn't activate a focus session
- **What:** Fresh `/app` shows four empty columns each with "Add task" — no board-level empty state, no "start timer" nudge, no sample task.
- **Why it matters:** Success metric is "enter flow within seconds." Empty columns are a wall, not an invitation.
- **Fix:** Board-level empty state: one primary CTA ("Add your first task"), secondary ("Start 25-min focus"), brief copy in chosen locale.
- **Suggested command:** `/impeccable onboard /app`

### [P2] Cryptic column chrome (crossTasks)
- **What:** Strikethrough icon toggles `crossTasks` with no label/tooltip beyond aria-label.
- **Why it matters:** Non-standard affordance; even Alex won't discover it. Fails recognition heuristic.
- **Fix:** Label on hover/tooltip ("Auto-complete tasks moved here") or move to column menu.
- **Suggested command:** `/impeccable clarify KanbanColumn`

## Persona Red Flags

**Alex (Power User):** Undo exists but isn't surfaced — no shortcuts legend, no ⌘Z hint. Must click "Add task" in header or per-column; no quick-add from keyboard. Column edit/delete icons are 28px targets clustered without tooltips.

**Jordan (First-Timer):** Lands on four empty columns — no explanation of Backlog vs To Do vs In Progress. Workspace "Personal" vs Categories distinction unclear. Mobile header is three unlabeled icons (tags, music, monitor).

**Sam (Accessibility):** Heading hierarchy jumps h1 → h3 (detector confirmed). Priority conveyed by red/yellow/green badges only — partially mitigated by text labels on badges. Timer tooltip disappears in 5s with no persistent alternative.

**Mira (Creator — project persona):** Opens for a focus session but sees setup chrome, not calm readiness. Timer tooltip ("Focus timer is here!") in English while welcome was Indonesian. Music and timer both anchor bottom-right — feels like widgets accumulating, not a studio.

## Minor Observations

- `Header` uses `animate-fade-in-up` on mount — product register discourages page-load choreography.
- Light-mode `--background` cream (`hsl(40 20% 98%)`) conflicts with DESIGN.md **No-Cream-Default Rule**.
- `h1` at `text-2xl font-bold` is loud for a tool shell; DESIGN.md specifies Syne for brand moments — unused here.
- Kanban horizontal scroll clips "Done" column; custom scrollbar helps on desktop but mobile affordance is weak.
- Delete task from kanban card has no confirmation (destructive icon visible on mobile always).

## Questions to Consider

- What if the app opened directly into the board with **one** bar — workspace left, actions right, no wordmark repetition?
- Does `/app` need a visible "Wazheefa" title at all once the user chose to work?
- What would the first 10 seconds look like if empty state **was** the focus session invitation?
