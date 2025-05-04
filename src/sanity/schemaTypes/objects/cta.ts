import resolveSlug from '@/sanity/lib/resolveSlug'
import { VscInspect } from 'react-icons/vsc'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'cta',
	title: 'Call-to-action',
	icon: VscInspect,
	type: 'object',
	fields: [
		defineField({
			name: 'link',
			type: 'link',
		}),
		defineField({
			name: 'style',
			type: 'string',
			options: {
				list: [
					'action',
					{ title: 'Outline', value: 'action-outline' },
					'ghost',
					'link',
				],
			},
		}),
	],
	preview: {
		select: {
			label: 'link.label',
			_type: 'link.internal._type',
			pageTitle: 'link.internal.title',
			internal: 'link.internal.metadata.slug.current',
			params: 'link.params',
			external: 'link.external',
		},
		prepare: ({ label, pageTitle, ...props }) => ({
			title: label || pageTitle,
			subtitle: resolveSlug(props),
		}),
	},
})
