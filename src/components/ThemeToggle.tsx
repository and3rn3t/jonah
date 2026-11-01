import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

// Per-device preference, so it stays in localStorage rather than shared KV
const STORAGE_KEY = 'theme-preference'

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="bg-card hover:bg-accent hover:text-accent-foreground touch-target-lg fixed top-4 right-4 z-50 h-11 w-11 rounded-full border-2 shadow-lg transition-all duration-300 sm:top-6 sm:right-6 sm:h-12 sm:w-12"
      style={{
        top: 'max(env(safe-area-inset-top, 16px), 16px)',
        right: 'max(env(safe-area-inset-right, 16px), 16px)',
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} weight="duotone" /> : <Sun size={20} weight="duotone" />}
    </Button>
  )
}
