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
		<aside className="rounded-md border border-gray-200 p-0 shadow-sm">
			<a
				href={resolvedLink}
				target="_blank"
				rel="noopener noreferrer"
				className="group block p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
			>
				<div className="flex gap-4">
					<div className="w-20 shrink-0 overflow-hidden rounded">
						<Img image={book.image} width={160} alt={book.title} />
					</div>
					<div className="space-y-1">
						<h3 className="font-semibold leading-tight group-hover:underline">
							{book.title}
						</h3>
						<div className="pt-1 text-sm font-medium text-blue-700">
							Learn more →
						</div>
					</div>
				</div>
			</a>
		</aside>
	)
}
