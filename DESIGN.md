---
name: Wazheefa
description: Calm, local-first focus studio for creators — refined utility without noise.
colors:
  focus-emerald: "#29a37a"
  focus-emerald-dark: "#3dbf94"
  ink-forest: "#13201b"
  surface-cream: "#fbfaf9"
  surface-card: "#ffffff"
  surface-muted: "#f1f4f2"
  border-mist: "#e3e8e6"
  signal-red: "#dc2828"
  dark-ground: "#0c1512"
  dark-surface: "#14201c"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.focus-emerald}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#248f6b"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-forest}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-outline:
    backgroundColor: "{colors.surface-cream}"
    textColor: "{colors.ink-forest}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: Wazheefa

## 1. Overview

**Creative North Star: "The Focus Studio"**

Wazheefa's visual system is a calm, opinionated workspace for creators entering a focus session. It borrows Linear's fast, modern SaaS craft — crisp hierarchy, confident defaults, minimal chrome — but trades corporate coolness for warmth and editorial restraint on the landing surface. The app shell is utilitarian and quiet; the marketing layer may carry serif drama and atmospheric imagery, but the product register always wins inside `/app`.

Density is comfortable, not sparse-for-show and not dashboard-heavy. Surfaces breathe; type does the hierarchy work. Motion is responsive (feedback and entrance) without choreography that competes with the task at hand.

This system explicitly rejects AI-default aesthetics: warm cream body backgrounds used as a lazy warmth signal, gradient text, decorative glassmorphism, identical icon-card grids, and uppercase eyebrow kickers on every section.

**Key Characteristics:**
- Emerald accent on tinted cool-green neutrals — focus and growth without startup-purple clichés
- Dual register: editorial landing (serif display + atmosphere) vs. tool-grade app (Inter + Syne brand)
- Tonal layering over heavy shadows; `shadow-sm` at rest, blur only on sticky chrome
- 12px base radius (`0.75rem`) — softly rounded, never pill-everything
- Local-first calm: no gamification visuals, no metric-hero patterns

## 2. Colors

A restrained palette: one confident emerald accent on cool-tinted neutrals. Warmth lives in accent usage and landing imagery, not in a sand-colored default body.

### Primary
- **Focus Emerald** (#29a37a / hsl(160 60% 40%)): Primary actions, focus rings, selection highlights, active states. The single voice of intent — use deliberately, not decoratively.
- **Focus Emerald (Dark mode)** (#3dbf94 / hsl(160 55% 55%)): Same role on dark ground; slightly lifted for contrast.

### Neutral
- **Ink Forest** (#13201b / hsl(155 25% 10%)): Primary text on light surfaces.
- **Surface Cream** (#fbfaf9 / hsl(40 20% 98%)): Light-mode page background. Cool-warm tinted; audit contrast when layering muted text.
- **Surface Card** (#ffffff): Elevated cards, popovers, inputs on light mode.
- **Surface Muted** (#f1f4f2 / hsl(150 10% 95%)): Secondary fills, accent hover backgrounds.
- **Border Mist** (#e3e8e6 / hsl(150 10% 90%)): Dividers, input borders, card outlines at 70% opacity in components.
- **Dark Ground** (#0c1512 / hsl(155 25% 6%)): Dark-mode page background.
- **Dark Surface** (#14201c / hsl(155 20% 10%)): Dark-mode cards and elevated panels.

### Signal
- **Signal Red** (#dc2828): Destructive actions, overdue task emphasis. Never used for brand accent.

### Named Rules
**The One Voice Rule.** Focus Emerald appears on ≤10% of any app screen — CTAs, active focus, selection. Its rarity signals intent; flooding the UI with green reads as templateware.

**The No-Cream-Default Rule.** Do not reach for warm sand/cream/paper body backgrounds as a shorthand for "friendly." If warmth is needed, carry it through typography, imagery, or a committed color strategy — not a near-white warm tint on every surface.

## 3. Typography

**Display Font:** Cormorant Garamond (with Georgia, serif) — landing hero only
**Brand Font:** Syne (with system-ui) — logo lockup, welcome states, brand moments
**Body Font:** Inter (with system-ui) — app UI, forms, task copy
**Grotesk Font:** DM Sans (with Helvetica Neue) — landing subheadlines, light-weight display lines
**Label/Mono Font:** JetBrains Mono — kickers, timestamps, technical labels

**Character:** Editorial serif meets Swiss utility. The landing may whisper magazine; the app speaks in clear Inter sentences. Pairing works because they never compete on the same screen real estate.

### Hierarchy
- **Display** (700, clamp(2.25rem–4rem), 1.05): Landing h1 only. Max ~18ch per line; italic accent word in emerald.
- **Headline** (600, 1.5–2rem, 1.2): App page titles, section headers. Syne or Inter semibold.
- **Title** (600, 1rem, 1.4): Task titles, card headers, dialog titles.
- **Body** (400, 0.875rem, 1.6): Descriptions, notes, helper text. Cap at 65–75ch in prose blocks.
- **Label** (600, 0.6875rem, uppercase, 0.2em tracking): Mono kickers on landing — one per page maximum, not per section.

### Named Rules
**The Register Split Rule.** Serif display is forbidden inside `/app`. App surfaces use Inter + Syne only. Breaking this collapses the product/brand boundary.

**The Kicker Restraint Rule.** Uppercase tracked mono labels are a landing accent, not section scaffolding. One kicker per page; never repeat the eyebrow-on-every-section pattern.

## 4. Elevation

Flat-by-default with tonal layering. Depth comes from background shifts (background → card → popover), border opacity, and selective `shadow-sm` on interactive cards — not from stacked drop shadows or glass stacks.

Sticky header and modal overlays use `backdrop-blur-xl` with semi-transparent backgrounds (`bg-background/80`). This is functional chrome, not decorative glassmorphism.

### Shadow Vocabulary
- **Card rest** (`shadow-sm`): Task cards, kanban cards at rest.
- **Thumb / control** (`0 1px 3px rgba(0,0,0,0.1)`): Range slider thumbs.
- **Hero panel** (`0 28px 90px rgba(3,8,20,0.34)`): Landing preview mockup only — never in app shell.
- **Pulse glow** (`0 0 20px primary/15%`): Accent emphasis on landing elements; use sparingly.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear as a response to elevation (cards, modals) or hover — never as default decoration on every container.

## 5. Components

Character: **Refined and restrained** — tactile feedback on press (`active:scale-[0.97]`), no bounce, no glow on every hover.

### Buttons
- **Shape:** Gently rounded (8px / `rounded-md`), 40px default height
- **Primary:** Focus Emerald fill, white text, hover at 90% opacity
- **Hover / Focus:** Color shift + `ring-2 ring-ring ring-offset-2` on focus-visible; scale down on active
- **Outline:** Border on input color, background fill, accent hover
- **Ghost:** Transparent; accent background on hover — toolbar actions, icon buttons

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`) on task cards; 12px system default elsewhere
- **Background:** `bg-card` on `bg-background`
- **Shadow Strategy:** `shadow-sm` at rest; red-tinted border/shadow for overdue state only
- **Border:** `border-border/70` — visible but quiet
- **Internal Padding:** 16px horizontal, 14px vertical on task cards

### Inputs / Fields
- **Style:** Border on `--input`, background matches page, 12px radius
- **Focus:** 2px ring in Focus Emerald via `--ring`
- **Error / Disabled:** Destructive color for errors; 50% opacity disabled

### Navigation
- **App header:** Sticky, `border-b border-border/60`, blurred background, 64px height
- **Landing nav:** Minimal, transparent over hero atmosphere
- **Theme toggle:** Ghost icon button cycling system → light → dark

### Task Card (signature)
- **Checkbox + title + metadata row:** Priority badge on hover; category dot uses user-assigned color
- **Completed state:** 55% opacity, line-through title
- **Overdue state:** Red border emphasis without side-stripe accent bars

## 6. Do's and Don'ts

### Do:
- **Do** use semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`) — never raw hex in components.
- **Do** keep Focus Emerald for actions and focus states only; let ink and muted neutrals carry the UI.
- **Do** respect `prefers-reduced-motion` — crossfade or instant state changes as the alternative to entrance animations.
- **Do** use `text-wrap: balance` on landing h1–h3; cap body prose at 65–75ch.
- **Do** test muted text contrast on cream and card surfaces — bump toward ink if below 4.5:1.

### Don't:
- **Don't** use AI-default aesthetics: warm cream/sand body backgrounds as a lazy warmth signal, gradient text, decorative glassmorphism, identical icon-card grids, uppercase eyebrow kickers on every section.
- **Don't** use generic SaaS patterns: hero metrics, purple gradients, startup-template card grids.
- **Don't** apply `border-left` greater than 1px as a colored stripe on cards, alerts, or list items.
- **Don't** use `background-clip: text` with gradients for headings — solid ink or solid emerald only.
- **Don't** stack nested cards or default every list item into identical card containers.
- **Don't** bring Cormorant serif display type into the `/app` task shell.
