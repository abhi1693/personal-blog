import { VscEdit } from 'react-icons/vsc'
import { defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'blog-post-list',
	title: 'Blog post list',
	type: 'object',
	icon: VscEdit,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
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
			name: 'limit',
			description: 'Number of posts to display',
			type: 'number',
			initialValue: 6,
			validation: (Rule) => Rule.min(1),
			group: 'options',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
		},
		prepare: ({ intro }) => ({
			title: getBlockText(intro),
			subtitle: 'Blog post (list)',
		}),
	},
})
