# Project Guidelines (AGENTS.md)

<!--
  Canonical, tool-neutral instructions for AI assistants. CLAUDE.md and
  .github/copilot-instructions.md only point here; edit this file.
-->

## Project Overview

Personal portfolio site for a teenager, showcasing anime favorites and swimming
achievements (timeline, goals, stats, photo gallery) with a password-protected admin panel
for editing content. Started from the GitHub Spark template; now deployed to
**Cloudflare Pages** at `jonahanderson.us`, with content persisted in Cloudflare KV.
Product spec: `PRD.md`; deploy guide: `DEPLOYMENT.md`.

## Stack

- React 19 + TypeScript 6 + Vite 7 (SWC), Tailwind CSS 4, Radix/shadcn UI
  (`src/components/ui/`), Motion (`motion/react`), Phosphor/Lucide icons
- **npm** (`package-lock.json`), Node `24.22.0` (`.nvmrc`)
- Cloudflare Pages Functions bound to KV namespace `SITE_KV` (`wrangler.toml`, project
  `jonah-portfolio`): `functions/api/kv/[key].ts` (GET/PUT) and `functions/api/messages.ts`
  (POST contact form); shared helpers in `functions/_lib/http.ts`

## Layout

```
src/
  App.tsx               # whole page + defaultContent + state; mutations happen here
  components/           # AdminPanel, PhotoGallery, PoolHeader, StatsDashboard,
                        # SwimmingGoals, SwimmingTimeline, ThemeToggle; ui/ = shadcn primitives
  hooks/useKV.ts        # useKV<T>(key, default): localStorage cache + /api/kv/:key sync
  lib/types.ts          # SiteContent, Profile, Anime, SwimmingAchievement, TimelineEvent,
                        # SwimmingGoal, ContactMessage, SocialLink (Photo lives in PhotoGallery.tsx)
  styles/theme.css      # theme CSS variables (light/dark)
functions/api/          # Pages Functions: kv/[key].ts backs useKV, messages.ts takes the contact form
functions/_lib/         # shared json() / isAdmin() helpers (no routes)
```

## Commands

```bash
npm install
npm run dev            # Vite + Spark plugin, port 5000; useKV falls back to localStorage
npm run lint           # eslint (lint:fix to autofix)
npm run typecheck      # tsc for src/ and functions/
npm run format:check   # prettier (format to write)
npm run build          # tsc -b --noCheck && vite build — doesn't type-check; run typecheck too
npm run pages:dev      # wrangler pages dev dist --kv SITE_KV (Functions + KV locally, after build;
                       # needs ADMIN_TOKEN in .dev.vars to unlock the admin panel)
```

CI (`ci.yml`) runs `npm run lint && npm run typecheck && npm run format:check && npm run build`.
There is no unit test suite; verify UI changes in the browser (mobile viewport and dark mode
too).

## Data & State

- Persistent data uses `useKV` from **`@/hooks/useKV`** (not `@github/spark/hooks`). Keys:
  `site-content`, `swimming-goals`, `gallery-photos` (public read) and `contact-messages`
  (admin read, `useKV(..., { requiresAuth: true, enabled })`). A new key must be added to
  the allowlists in `functions/api/kv/[key].ts` or the API returns 404.
- **Auth**: every PUT and every admin read needs `Authorization: Bearer <ADMIN_TOKEN>` (a Pages
  secret). The admin panel verifies the typed password against the server and keeps it in
  `sessionStorage` (`src/lib/adminToken.ts`). Visitors never write KV directly: the contact form
  POSTs to `/api/messages`.
- Theme preference is per-device `localStorage`, not KV.
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
- Animations: `motion/react` with typed `Variants`.
- Prettier: no semicolons, single quotes, width 100. Conventional commits enforced by
  commitlint (`.husky/commit-msg`).

## Deployment

`npm run deploy` (build + `wrangler pages deploy dist`) or the Cloudflare Pages Git
integration — see `DEPLOYMENT.md`. Never deploy, commit or push unless explicitly asked.
