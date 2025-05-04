import resolveUrl from '@/lib/resolveUrl'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'
import type { ComponentProps } from 'react'

export default function CTA({
	_type,
	_key,
	link,
	style,
	className,
	children,
	...rest
}: Sanity.CTA & ComponentProps<'a'>) {
	const props = {
		className: cn(stegaClean(style), className) || undefined,
		children:
			children || link?.label || link?.internal?.title || link?.external,
		...rest,
	}

	if (link?.type === 'internal' && link.internal)
		return (
			<Link
				href={resolveUrl(link.internal, {
					base: false,
					params: link.params,
				})}
				{...props}
			/>
		)

	if (link?.type === 'external' && link.external)
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		return <a href={stegaClean(link.external)} {...props} />

	return <div {...(props as ComponentProps<'div'>)} />
}
