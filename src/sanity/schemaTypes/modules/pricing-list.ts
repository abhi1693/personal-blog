import { count } from '@/lib/utils'
import { LuDollarSign } from 'react-icons/lu'
import { defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'pricing-list',
	title: 'Pricing list',
	icon: LuDollarSign,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'pretitle',
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
			name: 'tiers',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'pricing' }],
				},
			],
			group: 'content',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
			tiers: 'tiers',
		},
		prepare: ({ intro, tiers }) => ({
			title: getBlockText(intro) || count(tiers, 'tier'),
			subtitle: 'Pricing list',
		}),
	},
})
