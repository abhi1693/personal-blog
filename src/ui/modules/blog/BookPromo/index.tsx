import BookPromoClient from './BookPromoClient'
import { getBooksByAuthors } from '@/sanity/lib/queries'
import { headers } from 'next/headers'

export default async function BookPromo({
  authors,
}: {
  authors?: Sanity.Person[]
}) {
  const authorIds = authors?.map((a) => a?._id).filter(Boolean) as string[]
  const books = await getBooksByAuthors(authorIds)
	if (!books?.length) return null

	// Detect country from Vercel geolocation headers
	const h = await headers()
	const country = resolveCountryFromHeaders(h)

	return <BookPromoClient books={books} country={country} />
}

function resolveCountryFromHeaders(h: Headers): string | undefined {
	const code =
		h.get('x-vercel-ip-country') ||
		h.get('cf-ipcountry') ||
		h.get('x-geo-country') ||
		undefined
	return code ? code.toUpperCase() : undefined
}
