'use client'

import { useIsDesktop } from '@/hooks/useMatchMedia'
import type { ComponentProps } from 'react'

export default function MobileClosedDetails(props: ComponentProps<'details'>) {
	const isDesktop = useIsDesktop()

	return <details open={isDesktop} {...props} />
}
