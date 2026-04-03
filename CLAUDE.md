# CLAUDE.md

Project-specific guidance for Claude Code sessions.

## Project Overview

**Wazheefa** is a modern productivity app inspired by Next.js, JetBrains, and Apple design — combining desktop-grade utility with premium visual polish. Clean surfaces, strong hierarchy, and elegant simplicity.

**Key Concept**: Calm, minimal UI with focused productivity and refined interaction design.

## Repository

- **URL**: https://github.com/ahmadghaisanfad2/todoapp
- **Local Path**: `/Users/fadfad/Documents/Claude/01-projects/todoapp`

## Important Conventions

See `AGENTS.md` for comprehensive coding guidelines. Key points:

### TypeScript
- Strict mode enabled
- Use `import type` for type-only imports
- No enums — use union types
- Never use `as any` or `@ts-ignore`

### Components
- Named exports (except App.tsx uses default)
- Function declarations, not arrow functions
- Props interfaces above components

### State Management
- Zustand with persist middleware
- Individual selectors to avoid re-renders
- Safe localStorage wrapper with try/catch

### Styling
- Tailwind CSS v4
- Semantic color tokens (text-muted-foreground, bg-card, etc.)
- Use `cn()` utility for conditional classes
- Premium design system tokens in index.css

## Branding

- App name: **Wazheefa**
- Storage keys: `wazheefa-tasks`, `wazheefa-categories`, `wazheefa-settings`
- Old keys (`todoflow-*`) are migrated automatically on first load

## Quick Commands

```bash
npm run dev      # Start dev server
npm run build    # Type-check + production build
npm run lint     # ESLint across all .ts/.tsx files
npx tsc --noEmit # Type-check only
```

## Code Review

When reviewing PRs, check for:
1. CLAUDE.md and AGENTS.md compliance
2. TypeScript strict mode adherence
3. Proper import ordering
4. Individual Zustand selectors
5. Consistent use of union types over enums
6. No manual edits to shadcn/ui components
