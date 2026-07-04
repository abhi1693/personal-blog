import { VscEdit } from 'react-icons/vsc'
import { defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'blog-index',
	title: 'Blog index',
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
			name: 'postsPerPage',
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
			subtitle: 'Blog index',
		}),
	},
})
