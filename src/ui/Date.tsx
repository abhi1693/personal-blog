export default function DateComponent({
	value,
	itemProp,
	long,
}: {
	value?: string
	itemProp?: string
	long?: boolean
}) {
	if (!value) return null

	const formatted = new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
		year: 'numeric',
		month: long ? 'long' : 'short',
		day: 'numeric',
	})

	return (
		<time dateTime={value} itemProp={itemProp}>
			{formatted}
		</time>
	)
}
