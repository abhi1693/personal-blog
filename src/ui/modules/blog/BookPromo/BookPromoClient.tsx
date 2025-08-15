'use client'

import { Img } from '@/ui/Img'
import { useMemo } from 'react'

export default function BookPromoClient({
	books,
	country,
}: {
	books: Sanity.Book[]
	country?: string
}) {
	const book = useMemo(() => {
		if (!books?.length) return undefined
		const idx = Math.floor(Math.random() * books.length)
		return books[idx]
	}, [books])

	if (!book) return null

	const resolvedLink = useMemo(() => {
		const c = (country || '').toUpperCase()
		const match = book.countryLinks?.find(
			(cl) => cl?.country?.toUpperCase() === c,
		)
		return match?.link || book.defaultLink
	}, [book, country])

	return (
		<aside className="rounded-md border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-0 shadow-sm">
			<a
				href={resolvedLink}
				target="_blank"
				rel="noopener noreferrer"
				className="group block p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50/60 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
				onClick={() => {
					try {
						// GTM dataLayer
						// @ts-ignore
						window.dataLayer = window.dataLayer || []
						// @ts-ignore
						window.dataLayer.push({
							event: 'book_promo_click',
							book_title: book.title,
							country: country || undefined,
						})
						// gtag fallback
						// @ts-ignore
						if (typeof window.gtag === 'function') {
							// @ts-ignore
							window.gtag('event', 'book_promo_click', {
								event_category: 'engagement',
								event_label: book.title,
							})
						}
					} catch {}
				}}
			>
				<div className="flex items-start gap-4">
					{book.image && (
						<div className="w-20 h-28 shrink-0 overflow-hidden rounded">
							<Img
								image={book.image}
								width={160}
								height={224}
								className="h-full w-full object-cover"
								alt={book.title}
							/>
						</div>
					)}
					<div className="min-w-0 flex-1">
						<h3 className="line-clamp-3 font-semibold leading-tight group-hover:underline">
							{book.title}
						</h3>
						<div className="pt-2 text-sm font-medium text-blue-700">
							Get the book{' '}
							<span className="inline-block transition-transform group-hover:translate-x-0.5">
								→
							</span>
						</div>
					</div>
				</div>
			</a>
		</aside>
	)
}
