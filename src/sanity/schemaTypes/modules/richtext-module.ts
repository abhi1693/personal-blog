import { imageBlock, admonition } from '../fragments'
import { VscSymbolKeyword } from 'react-icons/vsc'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { getBlockText } from 'sanitypress-utils'

export default defineType({
	name: 'richtext-module',
	title: 'Richtext module',
	icon: VscSymbolKeyword,
	type: 'object',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'attributes' },
		{ name: 'options', title: 'Options' },
	],
	fields: [
		defineField({
			name: 'attributes',
			title: 'Module attributes',
			type: 'module-attributes',
			group: 'attributes',
		}),
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
