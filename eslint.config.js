// Extends the shared @and3rn3t/eslint-config with jonah-specific rules.
import and3rn3t from '@and3rn3t/eslint-config'

export default [
  ...and3rn3t,
  { ignores: ['src/components/ui'] },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
