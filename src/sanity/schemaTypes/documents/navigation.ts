import { count } from '@/lib/utils'
import { IoShareSocialOutline } from 'react-icons/io5'
import { VscMap, VscLayoutMenubar, VscLayoutPanelLeft } from 'react-icons/vsc'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'navigation',
	title: 'Navigation',
	icon: VscMap,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'items',
			type: 'array',
			of: [{ type: 'link' }, { type: 'link.list' }, { type: 'megamenu' }],
		}),
	],
	preview: {
		select: {
			title: 'title',
			items: 'items',
		},
		prepare: ({ title, items }) => {
			const t = title.toLowerCase()

			return {
				title,
				subtitle: count(items),
				media: t.includes('social')
					? IoShareSocialOutline
					: t.includes('header')
						? VscLayoutMenubar
						: t.includes('footer')
							? VscLayoutPanelLeft
							: null,
			}
		},
	},
})
