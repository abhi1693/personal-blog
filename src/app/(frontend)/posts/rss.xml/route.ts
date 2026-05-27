import { BASE_URL, BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG } from '@/lib/i18n'
import resolveUrl from '@/lib/resolveUrl'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { escapeHTML, toHTML } from '@portabletext/to-html'
import { Feed } from 'feed'
import { groq } from 'next-sanity'

function rewriteRelativeUrls(html: string, baseUrl: string): string {
	return html.replace(
		/(href|src)=["']\/(?!\/)([^"']+)["']/g,
		(match, attr, path) => {
			return `${attr}="${baseUrl}/${path}"`
		},
	)
}

export async function GET() {
	const { blog, posts, copyright } = await client.fetch<{
		blog: Sanity.Page
		posts: Array<Sanity.BlogPost & { image?: string }>
		copyright: string
	}>(
		groq`{
			'blog': *[_type == 'page' && metadata.slug.current == '${BLOG_DIR}'][0]{
				_type,
				title,
				metadata,
				'image': metadata.image.asset->url,
			},
			'posts': *[_type == 'blog.post'] | order(publishDate desc){
				_type,
				body,
				publishDate,
				authors[]->,
				metadata,
				'image': metadata.image.asset->url,
				language,
			},
			'copyright': pt::text(*[_type == 'site'][0].copyright)
		}`,
		{},
		{
			cache: 'no-store',
			perspective: 'published',
			useCdn: true,
		},
	)

	if (!blog || !posts) {
		return new Response(
			'Missing either a blog page or blog posts in Sanity Studio',
			{ status: 500 },
		)
	}

	const blogUrl = resolveUrl(blog, { base: true })
	const selfUrl = `${BASE_URL}/${BLOG_DIR}/rss.xml`

	const feed = new Feed({
		title: blog?.title || blog.metadata.title,
		description: blog.metadata.description,
		id: blogUrl,
		link: blogUrl,
		copyright,
		favicon: `${BASE_URL}/favicon.ico`,
		language: DEFAULT_LANG,
		generator: BASE_URL,
	})

	posts.map((post) => {
		const url = resolveUrl(post, { language: post.language })

		const date = new Date(post.publishDate)
		if (date > new Date()) {
			// Skip future posts
			return
		}

		return feed.addItem({
			title: escapeHTML(post.metadata.title),
			description: post.metadata.description,
			id: url,
			link: url,
			published: date,
			date,
			author: post.authors?.map((author) => ({ name: author.name })),
			content: rewriteRelativeUrls(
				toHTML(post.body, {
					components: {
						types: {
							image: ({ value: { alt = '', caption, source, ...value } }) => {
								const img = `<img src="${urlFor(value).url()}" alt="${escapeHTML(alt)}" />`
								const figcaption =
									caption && `<figcaption>${escapeHTML(caption)}</figcaption>`
								const aSource = source && `<a href="${source}">(Source)</a>`
								return `<figure>${[img, figcaption, aSource].filter(Boolean).join(' ')}</figure>`
							},
							admonition: ({ value: { title, content } }) =>
								`<dl><dt>${title}</dt><dd>${toHTML(content)}</dd></dl>`,
							code: ({ value }) =>
								`<pre><code>${escapeHTML(value.code)}</code></pre>`,
							'custom-html': () => '',
						},
					},
				}),
				BASE_URL,
			),
			image: post.image,
		})
	})

	let xml = feed.rss2()
	xml = xml.replace(/<rss version="2.0"([^>]*)>/, (_match, attrs) => {
		const newAttrs = [
			attrs,
			!attrs.includes('xmlns:atom=') &&
				`xmlns:atom="http://www.w3.org/2005/Atom"`,
			!attrs.includes('xmlns:media=') &&
				`xmlns:media="http://search.yahoo.com/mrss/"`,
		]
			.filter(Boolean)
			.join(' ')
		return `<rss version="2.0" ${newAttrs}>`
	})
	xml = xml.replace(
		/<channel>/,
		`<channel>\n<atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />`,
	)
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
		},
	})
}
