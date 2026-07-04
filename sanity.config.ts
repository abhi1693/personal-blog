'use client'

import pkg from './package.json'
import { presentation } from './src/sanity/presentation'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { supportedLanguages } from '@/lib/i18n'
import resolveUrl from '@/lib/resolveUrl'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import { assist } from '@sanity/assist'
import { codeInput } from '@sanity/code-input'
import {
	dashboardTool,
	projectInfoWidget,
	projectUsersWidget,
} from '@sanity/dashboard'
import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { media } from 'sanity-plugin-media'
import { icon, infoWidget } from 'sanitypress-utils'

const singletonTypes = ['site']

export default defineConfig({
	title: 'Administration',
	icon,
	projectId,
	dataset,
	basePath: '/admin',

	plugins: [
		structure,
		presentation,
		dashboardTool({
			name: 'info',
			title: 'Info',
			widgets: [
				projectInfoWidget(),
				projectUsersWidget(),
				infoWidget({ version: pkg.version }),
			],
		}),
		visionTool({ defaultApiVersion: apiVersion }),
		codeInput(),
		media(),
		assist(),
		documentInternationalization({
			supportedLanguages,
			schemaTypes: ['page', 'blog.post'],
		}),
	],

	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(
				({ schemaType }) => !singletonTypes.includes(schemaType),
			),
	},
	document: {
		productionUrl: async (prev, { document }) => {
			if (['page', 'blog.post'].includes(document?._type)) {
				return resolveUrl(document as Sanity.PageBase, { base: true })
			}
			return prev
		},

		actions: (input, { schemaType }) => {
			if (singletonTypes.includes(schemaType)) {
				return input.filter(
					({ action }) =>
						action && ['publish', 'discardChanges', 'restore'].includes(action),
				)
			}

			return input
		},
	},
})
