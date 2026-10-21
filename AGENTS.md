# Project Guidelines (AGENTS.md)

<!--
  Tool-neutral instructions for AI assistants. CLAUDE.md holds the longer
  Claude-oriented walkthrough (patterns, common tasks); keep the two consistent.
-->

## Project Overview

Personal portfolio site for a teenager, showcasing anime favorites and swimming
achievements (timeline, goals, stats, photo gallery) with a password-protected admin panel
for editing content. Started from the GitHub Spark template; now deployed to
**Cloudflare Pages** at `jonahanderson.us`, with content persisted in Cloudflare KV.
Product spec: `PRD.md`; deploy guide: `DEPLOYMENT.md`.

## Stack

- React 19 + TypeScript 6 + Vite 7 (SWC), Tailwind CSS 4, Radix/shadcn UI
  (`src/components/ui/`), Framer Motion, Recharts, Phosphor/Lucide icons
- **npm** (`package-lock.json`), Node `24.22.0` (`.nvmrc`)
- Cloudflare Pages Function `functions/api/kv/[key].ts` (GET/PUT) bound to KV namespace
  `SITE_KV` (`wrangler.toml`, project `jonah-portfolio`)

## Layout

```
src/
  App.tsx               # whole page + defaultContent + state; mutations happen here
  components/           # AdminPanel, PhotoGallery, PoolHeader, StatsDashboard,
                        # SwimmingGoals, SwimmingTimeline, ThemeToggle; ui/ = shadcn primitives
  hooks/useKV.ts        # useKV<T>(key, default): localStorage cache + /api/kv/:key sync
  hooks/use-mobile.ts
  lib/types.ts          # SiteContent, Profile, Anime, SwimmingAchievement, TimelineEvent,
                        # SwimmingGoal, ContactMessage, SocialLink (Photo lives in PhotoGallery.tsx)
  styles/theme.css      # theme CSS variables (light/dark)
functions/api/kv/       # Pages Function backing useKV
```

## Commands

```bash
npm install
npm run dev            # Vite + Spark plugin, port 5000; useKV falls back to localStorage
npm run lint           # eslint (lint:fix to autofix)
npm run typecheck      # tsc --noEmit
npm run format:check   # prettier (format to write)
npm run build          # tsc -b --noCheck && vite build — doesn't type-check; run typecheck too
npm run pages:dev      # wrangler pages dev dist --kv SITE_KV (Function + KV locally, after build)
```

CI (`ci.yml`) runs `npm run lint && npm run typecheck && npm run format:check && npm run build`.
There is no unit test suite; verify UI changes in the browser (mobile viewport and dark mode
too).

## Data & State

- Persistent data uses `useKV` from **`@/hooks/useKV`** (not `@github/spark/hooks`). Keys in
  use: `site-content`, `contact-messages`, `swimming-goals`, `gallery-photos`,
  `theme-preference`, `admin-password`.
- New content field: add it to the interface in `src/lib/types.ts`, a default in
  `defaultContent` in `App.tsx`, an editor in `AdminPanel.tsx`, and render it in the right
  section.
- `window.spark.user()` is still called when present (owner detection) and safely skipped
  otherwise.

## Conventions

- Functional components with a typed `Props` interface and named exports; no `any`.
- Imports: React, then external libraries, then `@/` internal imports.
- Tailwind classes only (prettier-plugin-tailwindcss sorts them); theme colors
  `primary`/`secondary`/`accent`/`background`/`foreground`; `dark:` for dark mode.
- Animations: Framer Motion with typed `Variants`.
- Prettier: no semicolons, single quotes, width 100. Conventional commits enforced by
  commitlint (`.husky/commit-msg`).

## Deployment

`npm run deploy` (build + `wrangler pages deploy dist`) or the Cloudflare Pages Git
integration — see `DEPLOYMENT.md`. Never deploy, commit or push unless explicitly asked.
