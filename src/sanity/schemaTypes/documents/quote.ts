import { VscQuote } from 'react-icons/vsc'
import { defineField, defineType } from 'sanity'
import { getBlockText } from 'sanitypress-utils'

export default defineType({
	name: 'quote',
	title: 'Quote',
	type: 'document',
	icon: VscQuote,
	fields: [
		defineField({
			name: 'quote',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'author',
			type: 'object',
			options: {
				columns: 2,
			},
			fields: [
				defineField({
					name: 'name',
					type: 'string',
				}),
				defineField({
					name: 'title',
					type: 'string',
				}),
				defineField({
					name: 'image',
					type: 'image',
					options: {
						hotspot: true,
						metadata: ['lqip'],
					},
				}),
			],
		}),
	],
	preview: {
		select: {
			quote: 'quote',
			author: 'author',
		},
		prepare: ({ quote, author }) => ({
			title: [author?.name, author?.title].filter(Boolean).join(' / '),
			subtitle: getBlockText(quote),
			media: author?.image?.asset,
		}),
	},
})
