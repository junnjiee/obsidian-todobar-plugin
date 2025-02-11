import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  // tseslint.configs.stylistic,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-console': 'warn',
      camelcase: 'warn',
      'no-var': 'error',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: false,
        },
      ],
    },
  },
)
