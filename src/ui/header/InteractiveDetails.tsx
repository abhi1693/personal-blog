'use client'

import css from './InteractiveDetails.module.css'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ComponentProps } from 'react'
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
	const [open, setOpen] = useState(false)
	let timeout: NodeJS.Timeout

	const events = !isMobile
		? {
				onMouseEnter: () => {
					if (delay) {
						timeout = setTimeout(() => setOpen(true), delay)
					} else {
						setOpen(true)
					}
				},
				onMouseLeave: () => {
					if (delay) clearTimeout(timeout)
					setOpen(false)
				},
			}
		: {}

	// Close after navigation
	const pathname = usePathname()
	useEffect(() => {
		if (closeAfterNavigate) setOpen(false)
	}, [closeAfterNavigate, pathname])

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
