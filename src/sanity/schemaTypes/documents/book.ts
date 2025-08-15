import { VscBook } from 'react-icons/vsc'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'book',
	title: 'Book',
	type: 'document',
	icon: VscBook,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'defaultLink',
			title: 'Default link',
			type: 'url',
			description: 'Used when no country-specific link matches',
			validation: (Rule) => Rule.uri({ allowRelative: false }).required(),
		}),
		defineField({
			name: 'countryLinks',
			title: 'Country-specific links',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'country',
							title: 'Country code',
							type: 'string',
							description: 'ISO 3166-1 alpha-2 (e.g., US, IN, GB)',
							validation: (Rule) => Rule.regex(/^[A-Z]{2}$/).required(),
						}),
						defineField({
							name: 'link',
							title: 'Link',
							type: 'url',
							validation: (Rule) =>
								Rule.uri({ allowRelative: false }).required(),
						}),
					],
					preview: {
						select: { title: 'country', subtitle: 'link' },
					},
				}),
			],
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true },
		}),
		defineField({
			name: 'authors',
			title: 'Authors',
			type: 'array',
			of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
			validation: (Rule) => Rule.min(1),
		}),
		defineField({
			name: 'active',
			title: 'Active',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		select: {
			title: 'title',
			media: 'image',
		},
	},
})
