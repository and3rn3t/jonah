# Contributing to Jonah

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 18+ (v24 recommended)
- npm 9+
- VS Code (recommended)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/and3rn3t/jonah.git
cd jonah

# Install dependencies
npm install

# Start development server
npm run dev
```

### Recommended VS Code Extensions

Install the recommended extensions when prompted, or manually install:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- Auto Rename Tag (`formulahendry.auto-rename-tag`)

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define interfaces for component props
- Use the types from `src/lib/types.ts`
- Prefer `interface` over `type` for object shapes

```typescript
interface MyComponentProps {
  title: string
  onAction: () => void
  children?: React.ReactNode
}
```

### React Components

- Use functional components with hooks
- Place component files in `src/components/`
- Use PascalCase for component files and names
- Export components as named exports

```typescript
export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click me</button>
    </div>
  )
}
```

### Imports

- Use the `@/` path alias for imports from `src/`
- Group imports: React, external libraries, internal modules, types
- Use named imports where possible

```typescript
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { SiteContent } from '@/lib/types'
```

### Styling

- Use Tailwind CSS classes
- Use the shadcn/ui components from `src/components/ui/`
- Follow the design system colors (primary, secondary, accent)
- Use CSS variables for theme colors

```tsx
<div className="bg-primary text-primary-foreground p-4 rounded-lg">
  Content
</div>
```

### Animations

- Use Framer Motion for animations
- Keep animations subtle and performant
- Use the existing animation patterns in `App.tsx`

```typescript
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
```

## Project Architecture

### State Management

- Use React hooks for local state
- Use `useKV` from `@github/spark/hooks` for persistent storage
- State flows down through props

### Components

| Directory | Purpose |
|-----------|---------|
| `src/components/` | Feature components |
| `src/components/ui/` | shadcn/ui primitives |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Utilities and types |

### Data Flow

1. `App.tsx` loads data from KV storage
2. Data is passed to child components via props
3. Admin panel updates are saved back to KV storage
4. Theme preference is stored separately in KV

## Making Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements
- `docs/description` - Documentation updates

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add swimming goal tracking component
fix: resolve photo gallery filter state issue
refactor: extract timeline event card to separate component
docs: update README with new scripts
```

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and type checking:
   ```bash
   npm run lint
   npm run typecheck
   ```
4. Test your changes locally
5. Create a pull request with a clear description

## Testing

### Manual Testing Checklist

- [ ] App loads without errors
- [ ] Dark mode toggle works
- [ ] Admin panel opens and saves data
- [ ] Photo gallery filters work
- [ ] Contact form submits
- [ ] Responsive layout works on mobile
- [ ] Animations are smooth

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Formatting

```bash
npm run format:check  # Check formatting
npm run format        # Fix formatting
```

## Adding New Features

### New Component

1. Create file in `src/components/`
2. Define props interface
3. Implement component
4. Export from component file
5. Import and use in `App.tsx` or parent component

### New UI Primitive

Use the shadcn/ui CLI or copy from their documentation:
- Components go in `src/components/ui/`
- Follow existing naming conventions

### New Data Type

1. Add interface to `src/lib/types.ts`
2. Update `SiteContent` if needed
3. Add default value in `App.tsx`
4. Update admin panel if editable

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

---

Thank you for contributing!
