import { createBlogFeedResponse } from './blog-feed'
import { BASE_URL, BLOG_DIR } from './env'
import { DEFAULT_LANG } from './i18n'
import resolveUrl from './resolveUrl'
import { client } from '@/sanity/lib/client'
import { dataset, projectId } from '@/sanity/lib/env'
import { urlFor } from '@/sanity/lib/image'
import { escapeHTML, toHTML } from '@portabletext/to-html'
import { groq } from 'next-sanity'

function rewriteRelativeUrls(html: string, baseUrl: string): string {
	return html.replace(
		/(href|src)=["']\/(?!\/)([^"']*)["']/g,
		(_match, attr, path) => `${attr}="${baseUrl}/${path}"`,
	)
}

export async function getBlogFeed(format: 'rss' | 'atom') {
	const { blog, posts, site } = await client.fetch<{
		blog: Sanity.Page | null
		posts: Array<Sanity.BlogPost & { image?: string }>
		site: { title?: string; _updatedAt?: string; copyright?: string } | null
	}>(
		groq`{
			'blog': *[_type == 'page' && metadata.slug.current == '${BLOG_DIR}'][0]{
				_type, title, metadata, _updatedAt,
			},
			'posts': *[_type == 'blog.post' && dateTime(publishDate + 'T00:00:00Z') <= dateTime(now())] | order(publishDate desc){
				_id, _type, _updatedAt, body, publishDate, authors[]->{name}, metadata,
				'image': metadata.image.asset->url,
				language,
			},
			'site': *[_type == 'site'][0]{title, _updatedAt, 'copyright': pt::text(copyright)}
		}`,
		{},
		{ cache: 'no-store', perspective: 'published', useCdn: true },
	)

	if (!blog || !posts) {
		return new Response(
			'Missing either a blog page or blog posts in Sanity Studio',
			{ status: 500 },
		)
	}

	const baseUrl = BASE_URL.replace(/\/+$/, '')
	return createBlogFeedResponse(
		{
			title: blog.title || blog.metadata.title,
			description: blog.metadata.description,
			url: resolveUrl(blog),
			baseUrl,
			rssUrl: `${baseUrl}/${BLOG_DIR}/rss.xml`,
			atomUrl: `${baseUrl}/${BLOG_DIR}/atom.xml`,
			updated: blog._updatedAt,
			siteUpdated: site?._updatedAt,
			author: site?.title || blog.title || blog.metadata.title,
			copyright: site?.copyright || '',
			language: DEFAULT_LANG,
			posts: posts.map((post) => ({
				// A document identity survives edits to the title, slug, and publication date.
				id: `https://${projectId}.api.sanity.io/v1/data/doc/${dataset}/${post._id}`,
				url: resolveUrl(post, { language: post.language }),
				title: post.metadata.title,
				description: post.metadata.description,
				published: post.publishDate,
				updated: post._updatedAt,
				authors: post.authors,
				image: post.image,
				content: rewriteRelativeUrls(
					toHTML(post.body || [], {
						components: {
							types: {
								image: ({ value: { alt = '', caption, source, ...value } }) => {
									const img = `<img src="${escapeHTML(urlFor(value).url())}" alt="${escapeHTML(alt)}" />`
									const figcaption =
										caption && `<figcaption>${escapeHTML(caption)}</figcaption>`
									const aSource =
										source && `<a href="${escapeHTML(source)}">(Source)</a>`
									return `<figure>${[img, figcaption, aSource].filter(Boolean).join(' ')}</figure>`
								},
								admonition: ({ value: { title = '', content } }) =>
									`<dl><dt>${escapeHTML(title)}</dt><dd>${toHTML(content || [])}</dd></dl>`,
								code: ({ value }) =>
									`<pre><code>${escapeHTML(value.code || '')}</code></pre>`,
								'custom-html': () => '',
							},
						},
					}),
					baseUrl,
				),
			})),
		},
		format,
	)
}
