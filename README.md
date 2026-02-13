# Jonah - Personal Portfolio

A vibrant personal portfolio web application showcasing anime favorites and swimming achievements. Built with React, TypeScript, and the GitHub Spark platform.

## Features

- **Hero Section** - Personal introduction with avatar and tagline
- **Anime Favorites** - Showcase favorite anime series with ratings and descriptions
- **Swimming Achievements** - Track personal bests, competitions, and milestones
- **Photo Gallery** - Filterable photo grid with lightbox modal
- **Contact Form** - Message system with email notifications
- **Admin Panel** - Full content management with password protection
- **Dark Mode** - Theme toggle with persistent preference
- **Stats Dashboard** - Visualize swimming progress and goals

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.7 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| Platform | GitHub Spark |
| State | @github/spark KV storage |

## Getting Started

### Prerequisites

- Node.js 18+ (v24 recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/and3rn3t/jonah.git
cd jonah

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5000

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── main.tsx                # Application entry point
├── index.css               # Global styles
├── components/
│   ├── AdminPanel.tsx      # Content management panel
│   ├── PhotoGallery.tsx    # Photo grid with lightbox
│   ├── PoolHeader.tsx      # Animated pool header
│   ├── StatsDashboard.tsx  # Swimming statistics
│   ├── SwimmingGoals.tsx   # Goal tracking component
│   ├── SwimmingTimeline.tsx # Event timeline
│   ├── ThemeToggle.tsx     # Dark/light mode toggle
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── use-mobile.ts       # Mobile detection hook
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
└── styles/
    └── theme.css           # Theme CSS variables
```

## Data Types

The application uses strongly-typed data structures:

- `SiteContent` - Main content structure (profile, anime, achievements, etc.)
- `Anime` - Anime entry with title, genre, rating, description
- `SwimmingAchievement` - Swimming event with time and achievement
- `TimelineEvent` - Timeline entry for swimming history
- `SwimmingGoal` - Goal tracking with target times
- `ContactMessage` - Contact form submission
- `SocialLink` - Social media profile links

See [src/lib/types.ts](src/lib/types.ts) for complete definitions.

## Configuration

### Path Aliases

The project uses `@/` as an alias for `src/`:

```typescript
import { Button } from '@/components/ui/button'
```

### Tailwind CSS

Custom theme colors are defined via CSS variables in [src/styles/theme.css](src/styles/theme.css) and extended in [tailwind.config.js](tailwind.config.js).

### VS Code

Recommended extensions are listed in [.vscode/extensions.json](.vscode/extensions.json). Install them for the best development experience.

## GitHub Spark Platform

This app uses the GitHub Spark platform for:

- **KV Storage** - Persistent data storage via `useKV` hook
- **User API** - Owner detection via `spark.user()`
- **Email Notifications** - Contact form notifications

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with GitHub Spark
