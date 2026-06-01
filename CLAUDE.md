# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # start dev server at http://localhost:3000
pnpm build      # production build
pnpm lint       # run ESLint (flat config, no separate script needed for single files)
```

There are no tests configured yet.

## Architecture

**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · pnpm

**App Router** — all routes live under `src/app/`. Files named `layout.tsx` and `page.tsx` are the Next.js conventions; everything else is a plain React component. Components are **Server Components by default**; add `'use client'` at the top only when browser APIs or interactivity are needed.

**Path alias** — `@/` resolves to `src/`, configured in `tsconfig.json`.

## Tailwind CSS v4

This project uses Tailwind v4 — the configuration model changed significantly:

- **No `tailwind.config.js`** — theme customization lives in CSS via `@theme` blocks.
- The global stylesheet uses `@import 'tailwindcss'` (not the old `@tailwind base/components/utilities` directives).
- PostCSS integration is via `@tailwindcss/postcss` (configured in `postcss.config.mjs`).

## ESLint

Uses the new flat config format (`eslint.config.mjs`). Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Run with `pnpm lint`.
