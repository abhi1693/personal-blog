'use client'

import css from './toc.module.css'
import { cn, slug } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import { useEffect, useRef, useState, type ComponentProps } from 'react'

export default function ToCItem({
	heading,
	...props
}: {
	heading: {
		style: string | null
		text: string | null
	}
} & ComponentProps<'li'>) {
	const ref = useRef<HTMLLIElement>(null)
	const [thresholdHeight, setThresholdHeight] = useState(0)

	useEffect(() => {
		const updateThresholdHeight = () =>
			setThresholdHeight(window.innerHeight / 2)
		updateThresholdHeight()

		window.addEventListener('resize', updateThresholdHeight)
		return () => window.removeEventListener('resize', updateThresholdHeight)
	}, [])

	useEffect(() => {
		if (typeof document === 'undefined' || !ref.current || !heading.text) return

		const target = ref.current
			.closest('[data-module]')
			?.querySelector(`#${slug(heading.text)}`)

		if (!target) return

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					ref.current?.classList.toggle(css.inView, entry.isIntersecting)
				})
			},
			{
				threshold: 1,
				rootMargin: `${document.documentElement.scrollHeight}px 0px -${thresholdHeight}px 0px`,
			},
		)

		observer.observe(target)
		return () => observer.disconnect()
	}, [heading.text, thresholdHeight])

	if (!heading.text) return null

	return (
		<li ref={ref} {...props}>
			<a
				href={`#${slug(heading.text)}`}
				className={cn('block py-1 hover:underline', {
					'ps-3': stegaClean(heading.style) === 'h2',
					'ps-6': stegaClean(heading.style) === 'h3',
					'ps-9': stegaClean(heading.style) === 'h4',
					'ps-12': stegaClean(heading.style) === 'h5',
					'ps-14': stegaClean(heading.style) === 'h6',
				})}
			>
				{heading.text}
			</a>
		</li>
	)
}
