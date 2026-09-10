import { escapeHTML } from '@portabletext/to-html'
import { Feed } from 'feed'

export type BlogFeedPost = {
	id: string
	url: string
	title: string
	description?: string
	content: string
	published: string
	updated?: string
	authors?: Array<{ name?: string } | null>
	image?: string
}

export type BlogFeedData = {
	title: string
	description?: string
	url: string
	baseUrl: string
	rssUrl: string
	atomUrl: string
	updated?: string
	siteUpdated?: string
	author: string
	copyright: string
	language: string
	posts: BlogFeedPost[]
}

export function createBlogFeedResponse(
	data: BlogFeedData,
	format: 'rss' | 'atom',
	now = new Date(),
) {
	const posts = data.posts.flatMap((post) => {
		const published = parseDate(post.published)
		if (!published || published > now) return []

		const updated = parseDate(post.updated)
		return [
			{
				post,
				published,
				updated: updated && updated > published ? updated : published,
			},
		]
	})
	// Feed timestamps describe content changes, rather than each HTTP request.
	const updated = new Date(
		Math.max(
			parseDate(data.updated)?.getTime() ?? 0,
			parseDate(data.siteUpdated)?.getTime() ?? 0,
			...posts.map((post) => post.updated.getTime()),
		),
	)
	const feed = new Feed({
		title: data.title,
		description: data.description,
		id: data.url,
		link: data.url,
		updated,
		author: { name: data.author, link: data.baseUrl },
		copyright: data.copyright,
		favicon: new URL('/favicon.ico', data.baseUrl).href,
		language: data.language,
		generator: data.baseUrl,
		feedLinks: { rss: data.rssUrl, atom: data.atomUrl },
	})

	for (const { post, published, updated } of posts) {
		const authors = post.authors?.flatMap((author) =>
			author?.name?.trim() ? [{ name: author.name.trim() }] : [],
		)
		feed.addItem({
			// Atom titles/summaries are HTML constructs; RSS titles are plain text.
			title: format === 'atom' ? escapeHTML(post.title) : post.title,
			description: escapeHTML(post.description || post.title),
			// Keep existing RSS GUIDs so subscribers do not see duplicate posts.
			id: format === 'atom' ? post.id : post.url,
			link: post.url,
			published,
			date: updated,
			author: format === 'atom' ? authors : undefined,
			extensions:
				format === 'rss'
					? [
							{
								name: 'dc:creator',
								objects: {
									_text: authors?.length
										? authors.map(({ name }) => name).join(', ')
										: data.author,
								},
							},
						]
					: undefined,
			content: post.content,
			image: post.image,
		})
	}

	let xml = format === 'atom' ? feed.atom1() : feed.rss2()
	// The serializer only declares dc when an item has non-empty content.
	if (format === 'rss' && !xml.includes('xmlns:dc=')) {
		xml = xml.replace(
			'<rss ',
			'<rss xmlns:dc="http://purl.org/dc/elements/1.1/" ',
		)
	}

	return new Response(xml, {
		headers: {
			'Content-Type': `application/${format === 'atom' ? 'atom' : 'rss'}+xml; charset=utf-8`,
			'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
		},
	})
}

function parseDate(value?: string) {
	if (!value) return undefined
	const date = new Date(value)
	return Number.isFinite(date.getTime()) ? date : undefined
}
