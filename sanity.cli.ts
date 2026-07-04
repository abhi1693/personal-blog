import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from '@/sanity/lib/env'

export default defineCliConfig({
	api: {
		projectId,
		dataset,
	},
	typegen: {
		enabled: true,
		path: './src/sanity/schemaTypes/**/*.{ts,tsx,js,jsx}',
		schema: './src/sanity/schema.json',
		generates: './src/sanity/types.ts',
	},
})
