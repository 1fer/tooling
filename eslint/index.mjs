// Shared ESLint preset for Nuxt 4 projects
import { createConfigForNuxt } from '@nuxt/eslint-config'
import prettier from 'eslint-config-prettier'

// Important: these are ESM-only plugins, import them dynamically in extends
const simpleImportSort = await import('eslint-plugin-simple-import-sort')
const unusedImports = await import('eslint-plugin-unused-imports')

export default createConfigForNuxt({
  features: {
    stylistic: false,
    typescript: true
  },
  ignores: [
    '.nuxt/**',
    '.output/**',
    'dist/**',
    'node_modules/**',
    'coverage/**',
    '.vercel/**',
    '.idea/**',
    '.vscode/**',
    '.turbo/**',
    '.husky/**'
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.vue'] },
      typescript: { project: ['./tsconfig.json'] }
    }
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'import/no-duplicates': 'warn',
    'import/order': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.{test,spec}.{js,ts,tsx,vue}',
          '**/vitest.config.{js,ts,mjs,cjs}',
          '**/cypress/**',
          '**/playwright/**',
          '**/.storybook/**',
          '**/scripts/**'
        ],
        optionalDependencies: false,
        peerDependencies: false
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }
    ],
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    '@typescript-eslint/no-floating-promises': 'error',

    // plugins rules
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
    ]
  },
  extends: [
    {
      plugins: {
        'simple-import-sort': simpleImportSort,
        'unused-imports': unusedImports
      }
    }
  ],
  overrides: [
    {
      files: ['server/**', '**/*.server.*', 'nuxt.config.{js,ts}', '*.config.{js,ts}'],
      languageOptions: { globals: { window: 'off', document: 'off' } }
    }
  ]
}).append(prettier)
