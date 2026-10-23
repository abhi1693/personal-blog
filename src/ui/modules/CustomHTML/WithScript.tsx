'use client'

import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import { ComponentProps, useEffect, useRef } from 'react'

/**
 * @description If the code includes a <script> tag, ensure the script is re-run on each render
 */
export default function WithScript({
	code,
	className,
	...props
}: Sanity.CustomHTML['html'] & Sanity.Module & ComponentProps<'section'>) {
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		const element = ref.current
		if (!element || !code) return
		element.replaceChildren(
			document.createRange().createContextualFragment(code),
		)
		return () => element.replaceChildren()
	}, [code])

	if (!code) return null

	return (
		<>
			<section ref={ref} className={className} {...moduleProps(props)} />
			<ModuleScopedCss {...props} />
		</>
	)
}
