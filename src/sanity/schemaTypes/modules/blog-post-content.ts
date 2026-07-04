import { VscEdit } from 'react-icons/vsc'
import { defineField } from 'sanity'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'blog-post-content',
	title: 'Blog post content',
	icon: VscEdit,
	type: 'object',
	groups: [{ name: 'sidebar', default: true }],
	fields: [
		defineField({
			name: 'sidebar',
			type: 'sidebar',
			group: 'sidebar',
		}),
	],
	preview: {
		select: {
			uid: 'attributes.uid',
		},
		prepare: ({ uid }) => ({
			title: 'Blog post content',
			subtitle: uid && `#${uid}`,
		}),
	},
})
