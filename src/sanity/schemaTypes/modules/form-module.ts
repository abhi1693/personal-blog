import { RxInput } from 'react-icons/rx'
import { defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'
import defineModule from '../fragments/define-module'

export default defineModule({
	name: 'form-module',
	title: 'Form module',
	type: 'object',
	icon: RxInput,
	groups: [{ name: 'content', default: true }],
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
			name: 'form',
			type: 'reference',
			to: [{ type: 'form' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
			form: 'form.identifier',
		},
		prepare: ({ intro, form }) => ({
			title: getBlockText(intro),
			subtitle: ['Form', form && `(${form})`].filter(Boolean).join(' '),
		}),
	},
})
