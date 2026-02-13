# GitHub Copilot Instructions

## Project Context

This is a React + TypeScript personal portfolio application built on the GitHub Spark platform. It showcases anime favorites and swimming achievements with full content management.

## Tech Stack

- React 19 with TypeScript 5.7
- Vite 7 for builds
- Tailwind CSS 4 for styling
- Radix UI + shadcn/ui components
- Framer Motion for animations
- @github/spark for persistence

## Code Style

### TypeScript
- Use strict typing, avoid `any`
- Define interfaces for all props
- Use types from `src/lib/types.ts`
- Prefer `interface` over `type` for objects

### React Patterns
- Functional components only
- Use hooks for state and effects
- Named exports for components
- Props destructuring in parameters

### Imports
```typescript
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { Anime } from '@/lib/types'
```

### Styling
- Tailwind CSS classes only
- Use theme colors: primary, secondary, accent
- Responsive prefixes: sm:, md:, lg:
- Dark mode: dark: prefix

## Key Patterns

### Component Template
```typescript
interface Props {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: Props) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

### KV Storage
```typescript
import { useKV } from '@github/spark/hooks'

const [data, setData] = useKV<Type>('key', defaultValue)
```

### Animations
```typescript
import { motion, Variants } from 'framer-motion'

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}
```

## File Locations

- Components: `src/components/`
- UI primitives: `src/components/ui/`
- Types: `src/lib/types.ts`
- Utilities: `src/lib/utils.ts`
- Hooks: `src/hooks/`

## Data Types

Primary types in `src/lib/types.ts`:
- `SiteContent` - Main content structure
- `Anime` - Anime with title, genre, rating
- `SwimmingAchievement` - Swimming records
- `TimelineEvent` - Timeline entries
- `SwimmingGoal` - Goal tracking
- `ContactMessage` - Form submissions
- `SocialLink` - Social profiles

## Conventions

- PascalCase for components
- camelCase for functions/variables
- Use `cn()` utility for conditional classes
- Keep components under 200 lines
- Use early returns for readability

## Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # Check linting
npm run typecheck # Type checking
npm run format    # Format code
```

## What to Avoid

- Class components
- Inline styles
- `any` type
- Direct DOM manipulation
- CSS modules (use Tailwind)
- Default exports (prefer named)
