'use client'

import css from './InteractiveDetails.module.css'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useRef, useState, type ComponentProps } from 'react'
import { isMobile } from 'react-device-detect'

/**
 * @param safeAreaOnHover - Adds a safe area around the details element to prevent it from closing when the mouse leaves the element
 * @param closeAfterNavigate - Closes the details element after a navigation event
 * @param delay - Delay in milliseconds before opening the details element
 * @param className - Additional class names to apply to the details element
 * @param props - Additional props to pass to the details element
 */
export default function InteractiveDetails({
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
	const pathname = usePathname()
	const [openState, setOpenState] = useState({ open: false, pathname })
	const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
	const open =
		closeAfterNavigate && openState.pathname !== pathname
			? false
			: openState.open
	const setOpen = (value: boolean) => setOpenState({ open: value, pathname })

	const events = !isMobile
		? {
				onMouseEnter: () => {
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
