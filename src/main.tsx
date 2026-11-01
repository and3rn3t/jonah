import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { ErrorBoundary } from 'react-error-boundary'

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { Toaster } from '@/components/ui/sonner'

import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {/* Honors the OS "reduce motion" setting for every motion/react animation */}
    <MotionConfig reducedMotion="user">
      <App />
      <Toaster />
    </MotionConfig>
  </ErrorBoundary>
)
