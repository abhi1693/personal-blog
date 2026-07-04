import { VscCode } from 'react-icons/vsc'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'custom-html',
	title: 'Custom HTML',
	icon: VscCode,
	type: 'object',
	groups: [
		{ name: 'html', title: 'HTML', default: true },
		{ name: 'css', title: 'CSS' },
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
			name: 'className',
			type: 'string',
			group: 'options',
		}),
		defineField({
			name: 'html',
			title: 'HTML',
			type: 'code',
			options: {
				language: 'html',
				languageAlternatives: [{ title: 'HTML', value: 'html' }],
			},
			group: 'html',
		}),
		defineField({
			name: 'css',
			title: 'CSS',
			type: 'code',
			options: {
				language: 'css',
				languageAlternatives: [{ title: 'CSS', value: 'css' }],
			},
			group: 'css',
		}),
	],
	preview: {
		select: {
			html: 'html.code',
			css: 'css.code',
		},
		prepare: ({ html, css }) => ({
			title: html || css,
			subtitle: html || !css ? 'Custom HTML' : 'Custom CSS',
		}),
	},
})
