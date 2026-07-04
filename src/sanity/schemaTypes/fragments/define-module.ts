import { defineField, defineType, type ObjectDefinition } from 'sanity'
import modulePreview from '@/sanity/ui/module-preview'

/**
 * Defines an object module with shared module attributes and preview badges.
 */
export default function defineModule(
	props: Omit<ObjectDefinition, 'groups' | 'fields' | 'preview'> & {
		groups?: ObjectDefinition['groups']
		fields: ObjectDefinition['fields']
		preview?: ObjectDefinition['preview']
	},
) {
	return defineType({
		...props,
		groups: [...(props.groups || []), { name: 'attributes' }],
		fields: [
			defineField({
				name: 'attributes',
				type: 'module-attributes',
				group: 'attributes',
			}),
			...props.fields,
		],
		components: { preview: modulePreview },
		preview: {
			...props.preview,
			select: {
				...props.preview?.select,
				attributes: 'attributes',
			},
			prepare(selection, viewOptions) {
				const output =
					props.preview?.prepare?.(selection, viewOptions) ?? selection
				const base =
					typeof output === 'object' && output !== null && !Array.isArray(output)
						? output
						: {}

				return {
					...base,
					hidden: selection.attributes?.hidden,
					uid: selection.attributes?.uid,
				} as any
			},
		},
	})
}
