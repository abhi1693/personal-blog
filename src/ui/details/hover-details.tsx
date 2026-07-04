'use client'

import css from './hover-details.module.css'
import { useIsDesktop } from '@/hooks/useMatchMedia'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ComponentProps } from 'react'

/**
 * Details element that opens on hover for desktop pointers and behaves as a
 * native disclosure on mobile.
 */
export default function HoverDetails({
	safeAreaOnHover,
	closeAfterNavigate,
	delay,
	className,
	...props
}: {
	safeAreaOnHover?: boolean
	closeAfterNavigate?: boolean
	delay?: number
} & ComponentProps<'details'>) {
	const isDesktop = useIsDesktop()
	const pathname = usePathname()
	const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
	const [openState, setOpenState] = useState({ open: false, pathname })
	const open =
		closeAfterNavigate && openState.pathname !== pathname
			? false
			: openState.open
	const setOpen = (value: boolean) => setOpenState({ open: value, pathname })

	const events = isDesktop
		? {
				onMouseEnter: () => {
					if (timeout.current) clearTimeout(timeout.current)
					if (delay) {
						timeout.current = setTimeout(() => setOpen(true), delay)
					} else {
						setOpen(true)
					}
				},
				onMouseLeave: () => {
					if (timeout.current) clearTimeout(timeout.current)
					setOpen(false)
				},
			}
		: {}

	useEffect(
		() => () => {
			if (timeout.current) clearTimeout(timeout.current)
		},
		[],
	)

	return (
		<details
			className={cn(safeAreaOnHover && css.safearea, className)}
			open={open}
			key={String(open)}
			{...events}
			{...props}
		/>
	)
}
