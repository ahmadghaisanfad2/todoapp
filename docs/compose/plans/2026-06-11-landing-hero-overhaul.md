# Landing Hero Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current landing page with a single premium hero screen inspired by Codex/OpenAI atmospheric gradients, including a generated background asset and a simplified product preview.

**Architecture:** Keep the landing route structurally simple: `LandingPage` renders only a slim nav, one full-height hero, and the existing enter transition. The redesign is driven by one generated background asset plus a tighter visual system in `index.css`, while `LandingHero.tsx` owns the new content hierarchy and preview card.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, existing shadcn/ui button, generated raster hero background asset

---

## File Structure

| File | Responsibility |
|---|---|
| `src/pages/LandingPage.tsx` | Reduce the page flow to nav + single hero + enter overlay |
| `src/components/landing/LandingNav.tsx` | Minimal one-row nav with brand + single CTA |
| `src/components/landing/LandingHero.tsx` | Full hero layout, copy, CTA, and product preview card |
| `src/index.css` | Atmospheric gradient behavior, hero-specific motion, and visual-system refinements |
| `src/assets/hero-atmosphere.png` | Generated deterministic hero background graphic used by the hero section |

---

### Task 1: Generate Hero Background Asset

**Files:**
- Create: `src/assets/hero-atmosphere.png`

- [ ] **Step 1: Generate the background image**

Prompt to use with the image generation workflow:

```text
Use case: ui-mockup
Asset type: landing page hero background
Primary request: create a smooth atmospheric background inspired by Codex/OpenAI design aesthetics
Style/medium: abstract premium digital gradient artwork
Composition/framing: landscape, wide enough for a hero section background, no focal subject, strong negative space for foreground text and UI card
Lighting/mood: calm, polished, intelligent, modern, subtle depth
Color palette: emerald green, teal, pale cyan, soft off-white haze, graphite undertones
Constraints: no text, no logos, no people, no literal objects, no hard edges, no busy patterns, no watermark
Avoid: sharp shapes, neon cyberpunk look, photographic subjects, decorative noise overload
```

- [ ] **Step 2: Save the chosen asset in the repo**

Save final file as:

```bash
src/assets/hero-atmosphere.png
```

- [ ] **Step 3: Verify the asset is present**

Run:

```bash
ls src/assets
```

Expected: `hero-atmosphere.png` appears in the output.

---

### Task 2: Simplify Landing Page Composition

**Files:**
- Modify: `src/pages/LandingPage.tsx`

- [ ] **Step 1: Replace the page body with the one-hero structure**

Target shape:

```tsx
      <LandingNav onNavigateApp={() => setIsEntering(true)} />
      <main>
        <LandingHero onNavigateApp={() => setIsEntering(true)} />
      </main>
```

Keep the existing `isEntering` overlay behavior intact.

- [ ] **Step 2: Remove imports that are no longer used**

After the change, `LandingPage.tsx` should import only:

```tsx
import { useState, useEffect } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingHero } from '@/components/landing/LandingHero'
```

- [ ] **Step 3: Run type-check for this edit**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 3: Redesign Landing Nav For One-Page Hero

**Files:**
- Modify: `src/components/landing/LandingNav.tsx`

- [ ] **Step 1: Remove old anchor navigation links**

Delete any links for multi-section navigation such as `#fitur`, `#tampilan`, or `#testimoni`.

- [ ] **Step 2: Keep the nav minimal**

Target content structure:

```tsx
<header>
  <div>
    <brand />
    <Button>Mulai Sekarang</Button>
  </div>
</header>
```

Visual requirements:
- slim, premium, quiet
- translucent background
- no extra menu clutter
- same emerald accent as the rest of the hero

- [ ] **Step 3: Run type-check for this edit**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 4: Rebuild Landing Hero Layout

**Files:**
- Modify: `src/components/landing/LandingHero.tsx`

- [ ] **Step 1: Replace the current hero with a full-height editorial composition**

Required layout:
- full viewport height
- left column: mono eyebrow, large Inter headline, short supporting paragraph, one primary CTA, one tiny trust line
- right column: one refined preview card showing simplified tasks + timer + music
- generated background asset behind both columns

- [ ] **Step 2: Use this copy direction**

Required tone:
- fewer words than the current hero
- premium, calm, focused
- no section-style marketing phrasing

Suggested copy block:

```tsx
<span>Flow-state task manager</span>
<h1>Fokus lebih tenang, selesaikan yang penting.</h1>
<p>Gabungkan tugas, timer, dan musik dalam satu ruang kerja yang terasa halus, ringan, dan nyaman dipakai setiap hari.</p>
```

CTA text:

```tsx
Mulai Sekarang
```

Trust line:

```tsx
Gratis. Tanpa daftar.
```

- [ ] **Step 3: Replace the existing preview card content with a cleaner product story**

The preview card should show a simplified mock combining:
- 2–3 task rows
- one compact timer chip
- one compact music chip

Avoid:
- too many tags
- too many colors
- dense dashboard look
- mock content that feels noisy

- [ ] **Step 4: Import and use the generated asset**

Add import:

```tsx
import heroAtmosphere from '@/assets/hero-atmosphere.png'
```

Use it as a hero background layer with a soft overlay so text remains readable.

- [ ] **Step 5: Run type-check for this edit**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 5: Refine Hero Visual System In CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add only the hero-specific utilities needed**

Allowed additions:
- soft background drift animation
- subtle fade-up entrance classes
- hero overlay utility if needed

Avoid adding a large new animation library or many one-off utilities.

- [ ] **Step 2: Ensure the background treatment stays smooth and restrained**

The final CSS should support:
- soft atmospheric background blending
- readable text over the asset
- subtle motion only

It should **not** introduce:
- flashy movement
- decorative floating icons
- obvious particle effects

- [ ] **Step 3: Verify mobile safety**

Ensure the hero still reads well on narrow screens:
- stacked layout
- no clipped headline
- preview card below copy
- CTA stays visible without scrolling too far

---

### Task 6: Visual Verification On Desktop And Mobile

**Files:**
- Verify: `src/pages/LandingPage.tsx`
- Verify: `src/components/landing/LandingNav.tsx`
- Verify: `src/components/landing/LandingHero.tsx`
- Verify: `src/index.css`

- [ ] **Step 1: Run the dev server**

Run:

```bash
npm run dev
```

Expected: app available at `http://localhost:5173`.

- [ ] **Step 2: Capture desktop screenshot**

Use browser automation to open `/` at desktop width and take a screenshot.

Success criteria:
- only one hero page visible
- nav is minimal
- generated background feels atmospheric and premium
- preview card reads clearly
- no old sections below the fold

- [ ] **Step 3: Capture mobile screenshot**

Use browser automation at mobile width.

Success criteria:
- headline wraps cleanly
- CTA remains prominent
- preview card stacks below the copy
- spacing is calm and uncluttered

- [ ] **Step 4: Run final static verification**

Run:

```bash
npx tsc --noEmit
npm run lint
```

Expected: both pass with no errors.

---

### Task 7: Commit The Overhaul

**Files:**
- Modify: all files touched above

- [ ] **Step 1: Review changed files**

Run:

```bash
git status
git diff -- src/pages/LandingPage.tsx src/components/landing/LandingNav.tsx src/components/landing/LandingHero.tsx src/index.css src/assets/hero-atmosphere.png
```

Expected: only the landing-page overhaul files appear.

- [ ] **Step 2: Commit the completed redesign**

Run:

```bash
git add src/pages/LandingPage.tsx src/components/landing/LandingNav.tsx src/components/landing/LandingHero.tsx src/index.css src/assets/hero-atmosphere.png
git commit -m "feat: redesign landing page into single atmospheric hero"
```

Expected: one clean feature commit.
