import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
        unicorn.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
      plugins: {
          unicorn,
      },
      rules: {
          '@typescript-eslint/no-explicit-any': 'error',
          '@typescript-eslint/no-unused-vars': [
              'error',
              { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
          ],
          'unicorn/prevent-abbreviations': 'off',
          'unicorn/no-null': 'off',
      },
  },
    prettier,
])
