import { imageBlock, admonition } from '../fragments'
import { VscSymbolKeyword } from 'react-icons/vsc'
import { defineArrayMember, defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'richtext-module',
	title: 'Richtext module',
	icon: VscSymbolKeyword,
	type: 'object',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'sidebar', title: 'Sidebar' },
		{ name: 'options', title: 'Options' },
	],
	fields: [
		defineField({
			name: 'content',
			type: 'array',
			of: [
				{ type: 'block' },
				imageBlock,
				admonition,
				defineArrayMember({
					title: 'Code block',
					type: 'code',
					options: {
						withFilename: true,
					},
				}),
				{ type: 'custom-html' },
			],
			group: 'content',
		}),
		defineField({
			name: 'sidebar',
			type: 'sidebar',
			group: 'sidebar',
		}),
		defineField({
			name: 'stretch',
			type: 'boolean',
			initialValue: false,
			group: 'options',
		}),
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare: ({ content }) => ({
			title: getBlockText(content),
			subtitle: 'Richtext module',
		}),
	},
})
