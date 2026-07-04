import { VscQuote } from 'react-icons/vsc'
import { defineField } from 'sanity'
import { count } from '@/lib/utils'
import { getBlockText } from 'sanitypress-utils'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'quote-list',
	title: 'Quote list',
	type: 'object',
	icon: VscQuote,
	groups: [
		{ name: 'content', default: true },
		{ name: 'quotes' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'eyebrow',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'quotes',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'quote' }] }],
			group: 'quotes',
		}),
		defineField({
			name: 'layout',
			type: 'string',
			options: {
				list: ['grid', 'carousel'],
			},
			group: 'options',
		}),
		defineField({
			name: 'columns',
			type: 'number',
			description:
				'Overrides the default dynamic columns (~256px). Desktop only.',
			validation: (Rule) => Rule.min(1),
			hidden: ({ parent }) => parent?.layout === 'carousel',
			group: 'options',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
			quotes: 'quotes',
		},
		prepare: ({ intro, quotes }) => ({
			title: getBlockText(intro),
			subtitle: `Quote list (${count(quotes, 'quote')})`,
		}),
	},
})
