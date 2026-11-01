# Claude Code Instructions

See [AGENTS.md](AGENTS.md) for the canonical project guide (stack, layout, commands, data/state, conventions, deployment).

## Claude-specific notes

- Run `npm run lint && npm run typecheck && npm run build` after changes (`build` does not type-check).
- Adding a content field: `src/lib/types.ts` → `src/content/defaults.ts` → editor in `src/components/admin/*Tab.tsx` → render in `src/sections/*`.
- Add shadcn primitives to `src/components/ui/` only when needed (`components.json` is kept for `shadcn add`).
- Don't commit, push or deploy unless asked.
