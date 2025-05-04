import { VscSymbolKeyword } from 'react-icons/vsc'
import { defineArrayMember, defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'

export default defineArrayMember({
	name: 'richtext',
	icon: VscSymbolKeyword,
	type: 'object',
	fields: [
		defineField({
			name: 'pretitle',
			type: 'string',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'block' }],
		}),
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare: ({ content }) => ({
			title: getBlockText(content),
			subtitle: 'Richtext',
		}),
	},
})
