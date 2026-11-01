import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Functions tests run in Node; src/ tests opt into jsdom with a @vitest-environment docblock
      environment: 'node',
      include: ['tests/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
      setupFiles: ['tests/support/setup.ts'],
      restoreMocks: true,
      unstubGlobals: true,
    },
  })
)
