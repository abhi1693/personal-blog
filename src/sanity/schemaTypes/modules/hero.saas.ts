import { reputationBlock } from '../misc/reputation'
import { TfiLayoutCtaCenter } from 'react-icons/tfi'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { getBlockText } from 'sanitypress-utils'

export default defineType({
	name: 'hero.saas',
	title: 'Hero (SaaS)',
	icon: TfiLayoutCtaCenter,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'asset' },
		{ name: 'attributes' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'attributes',
			title: 'Module attributes',
			type: 'module-attributes',
			group: 'attributes',
		}),
		defineField({
			name: 'pretitle',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [
				{ type: 'block' },
				defineArrayMember({
					title: 'Code block',
					type: 'code',
					options: {
						withFilename: true,
					},
				}),
				{ type: 'custom-html' },
				reputationBlock,
			],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'assets',
			title: 'Assets',
			type: 'array',
			of: [{ type: 'img' }],
			validation: (Rule) => Rule.max(1),
			group: 'asset',
		}),
		defineField({
			name: 'assetFaded',
			title: 'Faded',
			description: 'Add bottom fade to the asset',
			type: 'boolean',
			initialValue: true,
			group: 'asset',
		}),
	],
	preview: {
		select: {
			content: 'content',
			media: 'assets.0.image',
		},
		prepare: ({ content, media }) => ({
			title: getBlockText(content),
			subtitle: 'Hero (SaaS)',
			media,
		}),
	},
})
