import { FlatCompat } from '@eslint/eslintrc'
import studio from '@sanity/eslint-config-studio'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'prettier'],
  }),
	...studio,

  {
    rules: {
      'import/no-anonymous-default-export': 'off',
			'react-hooks/rules-of-hooks': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'react/no-unknown-property': 'off'
    },
  },
]

export default eslintConfig
