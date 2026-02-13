import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useKV<'light' | 'dark'>('theme-preference', 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 rounded-full w-11 h-11 sm:w-12 sm:h-12 shadow-lg border-2 bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-300 touch-target-lg"
      style={{ 
        top: 'max(env(safe-area-inset-top, 16px), 16px)',
        right: 'max(env(safe-area-inset-right, 16px), 16px)'
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={20} weight="duotone" />
      ) : (
        <Sun size={20} weight="duotone" />
      )}
    </Button>
  )
}
