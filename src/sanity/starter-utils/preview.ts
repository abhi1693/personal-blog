type PreviewBlock = {
	children?: { text?: string }[]
}

/** Keep schema preview text independent of the Studio/React dependency tree. */
export function getBlockText(
	blocks: PreviewBlock[] | null | undefined,
	lineBreakChar = '↵ ',
) {
	return (
		blocks
			?.map(
				(block) => block.children?.map((child) => child.text).join('') || '',
			)
			.join(lineBreakChar) || ''
	)
}

export function getPreset(
	preset: string | { title?: string; value: string },
	property: 'title' | 'value' = 'value',
) {
	return typeof preset === 'string'
		? preset
		: (preset[property] ?? preset.value)
}
