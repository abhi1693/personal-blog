/**
 * Return block content as plain text for schema previews.
 */
export default function (
	block?: {
		children?: {
			text: string
		}[]
	}[],
	lineBreakChar: string = '↵ ',
) {
	return (
		block?.reduce((text, current, index) => {
			const line =
				current.children?.flatMap((child) => child.text).join('') || ''

			return text + line + (index !== block.length - 1 ? lineBreakChar : '')
		}, '') || ''
	)
}
