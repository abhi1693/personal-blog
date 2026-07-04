'use client'

import { useIsDesktop } from '@/hooks/useMatchMedia'
import type { ComponentProps } from 'react'

/**
 * Details functionality that only collapses on mobile. On desktop, content is
 * always open and summary clicks outside links/buttons are ignored.
 */
export default function MobileOnlyDetails({
	name,
	...props
}: ComponentProps<'details'>) {
	const isDesktop = useIsDesktop()

	const detailsProps: ComponentProps<'details'> = isDesktop
		? {
				open: true,
				onClick: (event) => {
					const target = event.target as HTMLElement

					if (target.closest('a, button')) return

					event.preventDefault()
				},
			}
		: { name }

	return <details {...props} {...detailsProps} />
}
