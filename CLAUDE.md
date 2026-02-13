# Claude Code Instructions

This file provides context and instructions for Claude when working on this codebase.

## Project Overview

This is a **personal portfolio web application** called "Jonah" built for a teenager to showcase anime favorites and swimming achievements. It uses the GitHub Spark platform for deployment and data persistence.

## Tech Stack

- **React 19** with functional components and hooks
- **TypeScript 5.7** with strict null checks
- **Vite 7** for development and builds
- **Tailwind CSS 4** for styling
- **Radix UI** primitives with shadcn/ui components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **@github/spark** for KV storage and platform APIs

## Key Files

| File                              | Purpose                                |
| --------------------------------- | -------------------------------------- |
| `src/App.tsx`                     | Main application component (846 lines) |
| `src/lib/types.ts`                | TypeScript type definitions            |
| `src/components/AdminPanel.tsx`   | Content management interface           |
| `src/components/PhotoGallery.tsx` | Photo grid with lightbox               |
| `src/components/ui/`              | shadcn/ui component library            |

## Architecture Patterns

### State Management

- Local state with `useState` for UI state
- `useKV` hook from `@github/spark/hooks` for persistent data
- Data flows down through props, mutations happen in `App.tsx`

### Component Structure

```typescript
interface ComponentProps {
  prop1: string
  onAction: () => void
}

export function Component({ prop1, onAction }: ComponentProps) {
  // Implementation
}
```

### Import Conventions

```typescript
// React imports first
import { useState, useEffect } from 'react'

// External libraries
import { motion, Variants } from 'framer-motion'

// Internal imports using @/ alias
import { Button } from '@/components/ui/button'
import type { SiteContent } from '@/lib/types'
```

### Styling

- Use Tailwind CSS classes exclusively
- Theme colors: `primary`, `secondary`, `accent`, `background`, `foreground`
- Dark mode via CSS variables and `dark:` prefix
- Responsive: `sm:`, `md:`, `lg:` breakpoints

## Data Types

All types are defined in `src/lib/types.ts`:

- `SiteContent` - Root data structure
- `Profile` - User profile info
- `Anime` - Anime entry
- `SwimmingAchievement` - Swimming record
- `TimelineEvent` - Swimming timeline event
- `SwimmingGoal` - Goal tracking
- `ContactMessage` - Contact form entry
- `SocialLink` - Social media link

## GitHub Spark Platform

### KV Storage

```typescript
import { useKV } from '@github/spark/hooks'

// Read/write persistent data
const [data, setData] = useKV<DataType>('key', defaultValue)
```

### User Detection

```typescript
import spark from '@github/spark'

const user = await spark.user()
const isOwner = user?.isOwner ?? false
```

## Common Tasks

### Adding a New Component

1. Create `src/components/NewComponent.tsx`
2. Define props interface
3. Export as named export
4. Import in parent component

### Adding a New Field to Content

1. Add to interface in `src/lib/types.ts`
2. Add default value in `App.tsx` `defaultContent`
3. Add editing UI in `AdminPanel.tsx`
4. Display in appropriate section

### Adding a New UI Component

shadcn/ui components are in `src/components/ui/`. Add new primitives following the existing pattern with Radix UI.

## Code Quality

### Commands

```bash
npm run lint        # ESLint check
npm run lint:fix    # Auto-fix ESLint issues
npm run typecheck   # TypeScript check
npm run format      # Prettier format
```

### Style Guidelines

- Use functional components only
- Prefer const over let
- Use early returns for cleaner code
- Keep components focused and small
- Extract reusable logic to hooks

## File Structure

```
src/
├── App.tsx              # Main app, state management
├── main.tsx             # Entry point
├── index.css            # Global CSS imports
├── components/
│   ├── AdminPanel.tsx   # Admin CRUD interface
│   ├── PhotoGallery.tsx # Photo management
│   ├── PoolHeader.tsx   # Swimming header animation
│   ├── StatsDashboard.tsx # Charts and stats
│   ├── SwimmingGoals.tsx # Goal tracking
│   ├── SwimmingTimeline.tsx # Timeline display
│   ├── ThemeToggle.tsx  # Light/dark toggle
│   └── ui/              # 30+ shadcn/ui components
├── hooks/
│   └── use-mobile.ts    # Mobile detection
├── lib/
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # cn() utility
└── styles/
    └── theme.css        # CSS variables
```

## Testing Changes

1. Run `npm run dev` to start development server
2. Open <http://localhost:5000>
3. Test feature in browser
4. Check console for errors
5. Test on mobile viewport
6. Test dark mode
7. Run `npm run lint && npm run typecheck`

## Common Pitfalls

- **Unused imports**: Remove unused imports to avoid lint warnings
- **Key props**: Always use unique keys in lists
- **Type safety**: Use the defined types, don't use `any`
- **Tailwind order**: Use consistent class ordering
- **Framer Motion**: Use `Variants` type for animation definitions

## Animation Patterns

```typescript
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  Content
</motion.div>
```

## Environment

- Development server runs on port 5000
- No environment variables required
- Works in GitHub Codespaces
- Deploys via GitHub Spark platform
