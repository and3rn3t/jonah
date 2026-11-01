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
  (POST contact form); gallery images in R2 bucket `PHOTOS` via `functions/api/photos/[id].ts`;
  shared helpers in `functions/_lib/http.ts`

## Layout

```
src/
  App.tsx               # page composition: loads site-content/swimming-goals, orders sections
  content/defaults.ts   # defaultContent, defaultGoals (shown until KV has data)
  sections/             # page sections: ProfileHero, AnimeSection, SwimmingSection, AboutSection,
                        # ConnectSection + ContactForm; Section.tsx = shared heading wrapper
  components/           # AdminPanel (unlock + tab shell), PhotoGallery, PoolHeader, StatsDashboard,
                        # SwimmingGoals, SwimmingTimeline, ThemeToggle; ui/ = shadcn primitives
  components/admin/     # one file per admin tab (<Name>Tab.tsx); content tabs take ContentTabProps
                        # and edit AdminPanel's draft, Goals/Photos tabs write their KV keys directly
  hooks/useKV.ts        # useKV<T>(key, default): localStorage cache + /api/kv/:key sync
  lib/types.ts          # SiteContent, Profile, Anime, SwimmingAchievement, TimelineEvent,
                        # SwimmingGoal, ContactMessage, SocialLink, Photo
  lib/photos.ts         # compress (WebP, max 1600px) + upload/delete gallery images in R2
  lib/motion.ts         # shared containerVariants / itemVariants
  lib/social.ts         # social platform → icon + brand colors
  main.css, index.css   # Tailwind 4 theme (@theme), light/.dark CSS variables, custom utilities
functions/api/          # Pages Functions: kv/[key].ts backs useKV, messages.ts takes the contact form
functions/_lib/         # shared json() / isAdmin() helpers (no routes)
```

## Commands

```bash
npm install
npm run dev            # Vite, port 5000 (no Functions: useKV falls back to localStorage)
npm run lint           # eslint (lint:fix to autofix)
npm run typecheck      # tsc for src/, functions/ and tests/
npm run format:check   # prettier for src/, functions/, tests/ (format to write)
npm test               # vitest run (test:watch for watch mode)
npm run build          # tsc -b --noCheck && vite build — doesn't type-check; run typecheck too
npm run pages:dev      # wrangler pages dev dist --kv SITE_KV --r2 PHOTOS (Functions locally, after build;
                       # needs ADMIN_TOKEN in .dev.vars to unlock the admin panel)
```

CI (`ci.yml`) runs `npm run lint && npm run typecheck && npm run format:check && npm test && npm run build`.

Tests (Vitest):
- `tests/functions/*.test.ts`: Pages Functions handlers called directly with in-memory KV/R2
  fakes from `tests/support/cloudflare.ts` (Node env; `tests/support/setup.ts` polyfills the
  Workers-only `crypto.subtle.timingSafeEqual`). Cover auth and validation for any new endpoint.
- `src/**/*.test.ts(x)`: client code; add `// @vitest-environment jsdom` for hooks/components.
- No component/UI tests yet: verify UI changes in the browser (mobile viewport and dark mode too).
- Dependency changes: macOS npm drops bundled `@emnapi/*` entries from `package-lock.json` and
  CI's `npm ci` then fails. Regenerate the lockfile in a `node:24` Linux container
  (`npm install --package-lock-only`) before pushing.

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
- Gallery images: `gallery-photos` in KV holds only metadata; each image is an R2 object served
  at `/api/photos/<id>` (immutable cache, so never reuse an id). Older entries may still hold
  base64 `data:` URLs until "Move photos" in the admin Photos tab is run.
- New content field: add it to the interface in `src/lib/types.ts`, a default in
  `src/content/defaults.ts`, an editor in the matching `src/components/admin/*Tab.tsx`, and
  render it in the matching `src/sections/*` component.

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
