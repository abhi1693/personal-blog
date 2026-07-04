import { imageBlock } from '../fragments'
import { VscSymbolKeyword } from 'react-icons/vsc'
import { defineArrayMember, defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'prose',
	title: 'Prose',
	type: 'object',
	icon: VscSymbolKeyword,
	groups: [
		{ name: 'content', default: true },
		{ name: 'sidebar' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'content',
			type: 'array',
			of: [
				{ type: 'block' },
				imageBlock,
				defineArrayMember({
					type: 'code',
					title: 'Code block',
					options: { withFilename: true },
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
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare: ({ content }) => ({
			title: getBlockText(content),
			subtitle: 'Prose',
		}),
	},
})
