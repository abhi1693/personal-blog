import { dev } from './env'
import { stegaClean } from 'next-sanity'
import { createElement } from 'react'

export default function ({
	_type,
	attributes,
	_key,
	...props
}: Partial<Sanity.Module>) {
	return {
		id: stegaClean(attributes?.uid) || 'module-' + _key,
		'data-module': _type,
		hidden: !dev && attributes?.hidden,
		...props,
	}
}

export function ModuleScopedCss({
	_key,
	attributes,
}: Partial<Sanity.Module>) {
	const uid = stegaClean(attributes?.uid) || 'module-' + _key
	const css = stegaClean(attributes?.scopedCss?.code)

	if (!uid || !css) return null

	return createElement('style', {
		dangerouslySetInnerHTML: {
			__html: `@scope ([id="${escapeCssString(uid)}"]){${css}}`,
		},
	})
}

function escapeCssString(value: string) {
	return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}
