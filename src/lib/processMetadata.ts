import { BASE_URL, BLOG_DIR } from './env'
import { DEFAULT_LANG } from './i18n'
import resolveUrl from './resolveUrl'
import type { Metadata } from 'next'

export default async function processMetadata(
	page: (Sanity.Page | Sanity.BlogPost) & {
		translations?: {
			slug: string
			language?: string
		}[]
	},
): Promise<Metadata> {
	const url = resolveUrl(page)
	const { title, description, ogimage, noIndex, slug } = page.metadata
	const markdownUrl = getMarkdownUrl(page, url)

	// If slug is index, use description in images for title
	const ogTitle = slug.current === 'index' ? description : title

	return {
		metadataBase: new URL(BASE_URL),
		title,
		description,
		category: 'technology',
		openGraph: {
			type: 'website',
			url,
			title,
			description,
			images:
				ogimage || `${BASE_URL}/api/og?title=${encodeURIComponent(ogTitle)}`,
			siteName: title,
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images:
				ogimage || `${BASE_URL}/api/og?title=${encodeURIComponent(ogTitle)}`,
		},
		robots: {
			index: noIndex ? false : undefined,
		},
		alternates: {
			canonical: url,
			languages: Object.fromEntries(
				page.translations
					?.filter((t) => !!t?.language && !!t?.slug)
					?.map(({ language, slug }) => [
						language,
						[BASE_URL, language !== DEFAULT_LANG && language, slug]
							.filter(Boolean)
							.join('/'),
					]) || [],
			),
			types: {
				'application/rss+xml': `/${BLOG_DIR}/rss.xml`,
				...(markdownUrl ? { 'text/markdown': markdownUrl } : {}),
			},
		},
		verification: {
			other: {
				'google-adsense-account': process.env.NEXT_GOOGLE_ADSENSE_ID ?? '',
			},
		},
	}
}

function getMarkdownUrl(page: Sanity.Page | Sanity.BlogPost, url: string) {
	if (page._type === 'page' && !page.markdown?.code) return undefined

	const normalizedUrl = url.replace(/\/+$/, '')
	const baseUrl = BASE_URL.replace(/\/+$/, '')

	if (normalizedUrl === baseUrl) return `${baseUrl}/index.md`

	return `${normalizedUrl}.md`
}
