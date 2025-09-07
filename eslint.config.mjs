import { FlatCompat } from '@eslint/eslintrc'
import studio from '@sanity/eslint-config-studio'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/**',
      'tests/**',
    ],
  },
  ...compat.config({
  extends: ['next', 'prettier'],
  }),
  ...studio,
  {
    rules: {
      'import/no-anonymous-default-export': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unknown-property': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    },
  },
  {
    files: ['scripts/**/*.js', 'tests/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]

export default eslintConfig
