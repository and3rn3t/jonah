import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
    },
  },
  server: {
    port: 5000,
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks stay cached across content/app deploys
        manualChunks: (id: string): string | undefined => {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react'
          if (/node_modules\/(motion|motion-dom|motion-utils|framer-motion)\//.test(id)) {
            return 'vendor-motion'
          }
          return undefined
        },
      },
    },
  },
})
