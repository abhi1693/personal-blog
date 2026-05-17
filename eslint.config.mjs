import studio from '@sanity/eslint-config-studio'
import nextVitals from 'eslint-config-next/core-web-vitals'

const studioWithoutDuplicatePlugins = studio.filter((config) => {
	const plugins = Object.keys(config.plugins ?? {})
	return !plugins.some((plugin) =>
		['react', 'react-hooks', 'jsx-a11y'].includes(plugin),
	)
})

const eslintConfig = [
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
	...nextVitals,
	...studioWithoutDuplicatePlugins,
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
