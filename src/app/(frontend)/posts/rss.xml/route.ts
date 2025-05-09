import { BASE_URL, BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG } from '@/lib/i18n'
import resolveUrl from '@/lib/resolveUrl'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { escapeHTML, toHTML } from '@portabletext/to-html'
import { Feed } from 'feed'
import { groq } from 'next-sanity'

export async function GET() {
	const { blog, posts, copyright } = await fetchSanityLive<{
		blog: Sanity.Page
		posts: Array<Sanity.BlogPost & { image?: string }>
		copyright: string
	}>({
		query: groq`{
			'blog': *[_type == 'page' && metadata.slug.current == '${BLOG_DIR}'][0]{
				_type,
				title,
				metadata,
				'image': metadata.image.asset->url,
			},
			'posts': *[_type == 'blog.post']{
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
	})

	if (!blog || !posts) {
		return new Response(
			'Missing either a blog page or blog posts in Sanity Studio',
			{ status: 500 },
		)
	}

	const blogUrl = resolveUrl(blog, { base: true }) // Full absolute URL
	const feedUrl = `${BASE_URL}/${BLOG_DIR}/rss.xml`

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

		return feed.addItem({
			title: escapeHTML(post.metadata.title),
			description: post.metadata.description,
			id: url,
			link: url,
			published: new Date(post.publishDate),
			date: new Date(post.publishDate),
			author: post.authors?.map((author) => ({ name: author.name })),
			content: toHTML(post.body, {
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
			image: post.image,
		})
	})

	const atomXml = feed.atom1()
	const selfLinkTag = `<link rel="self" type="application/atom+xml" href="${feedUrl}" />`
	const atomWithSelfLink = atomXml.replace(
		'<feed xmlns="http://www.w3.org/2005/Atom">',
		`<feed xmlns="http://www.w3.org/2005/Atom">\n  ${selfLinkTag}`,
	)

	return new Response(atomWithSelfLink, {
		headers: {
			'Content-Type': 'application/atom+xml',
		},
	})
}
