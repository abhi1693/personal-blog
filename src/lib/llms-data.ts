import { BASE_URL, BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG, languages } from '@/lib/i18n'
import type { LlmsIndex, LlmsPageMarkdown, LlmsPostEntry } from '@/lib/llms'
import { blogPostToMarkdown } from '@/lib/portableTextMarkdown'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import 'server-only'

type SanityLlmsEntry = {
	title?: string
	url?: string
	description?: string
	updatedAt?: string
}

type SanityLlmsPost = SanityLlmsEntry & {
	publishedAt?: string
	authors?: string[]
	categories?: string[]
	manualMarkdown?: string
	body?: any[]
	youtubeEmbed?: {
		videoID?: string
		videoId?: string
	}
	faq?: Sanity.BlogPost['faq']
}

type SanityPageMarkdown = SanityLlmsEntry & {
	content?: string
}

type SanityLlmsData = {
	site?: {
		title?: string
		description?: string
	}
	pages?: SanityLlmsEntry[]
	posts?: SanityLlmsPost[]
	authors?: SanityLlmsEntry[]
	categories?: SanityLlmsEntry[]
}

export async function getLlmsIndex({
	includeContent = false,
}: {
	includeContent?: boolean
} = {}): Promise<LlmsIndex> {
	const data = await client.fetch<SanityLlmsData>(
		groq`{
			'site': *[_type == 'site'][0]{
				title,
				'description': pt::text(blurb)
			},
			'pages': *[
				_type == 'page' &&
				metadata.noIndex != true &&
				!(metadata.slug.current in ['404'])
			]|order(metadata.slug.current asc){
				'title': coalesce(metadata.title, title),
				'description': metadata.description,
				'updatedAt': _updatedAt,
				'url': (
					$baseUrl
					+ select(defined(language) && language != $defaultLang => language + '/', '')
					+ select(metadata.slug.current == 'index' => '', metadata.slug.current)
				)
			},
			'posts': *[
				_type == 'blog.post' &&
				metadata.noIndex != true
			]|order(publishDate desc){
				${POST_MARKDOWN_FIELDS}
				${
					includeContent
						? `
							${POST_MARKDOWN_CONTENT_FIELDS}
						`
						: ''
				}
				'url': (
					$baseUrl
					+ select(defined(language) && language != $defaultLang => language + '/', '')
					+ '${BLOG_DIR}/'
					+ metadata.slug.current
				)
			},
			'authors': *[_type == 'person' && defined(slug.current)]|order(name asc){
				'title': name,
				'description': coalesce(tagline, title, pt::text(bio)),
				'updatedAt': _updatedAt,
				'url': $baseUrl + 'authors/' + slug.current
			},
			'categories': *[
				_type == 'blog.category' &&
				defined(slug.current) &&
				count(*[_type == 'blog.post' && metadata.noIndex != true && references(^._id)]) > 0
			]|order(title asc){
				'title': title,
				'updatedAt': _updatedAt,
				'url': $baseUrl + '${BLOG_DIR}/category/' + slug.current
			}
		}`,
		{
			baseUrl: `${BASE_URL.replace(/\/+$/, '')}/`,
			defaultLang: DEFAULT_LANG,
		},
		{
			perspective: 'published',
			useCdn: true,
		},
	)

	return {
		title: data.site?.title || 'Personal Blog',
		description: data.site?.description,
		baseUrl: BASE_URL.replace(/\/+$/, ''),
		sitemapUrl: `${BASE_URL.replace(/\/+$/, '')}/sitemap.xml`,
		rssUrl: `${BASE_URL.replace(/\/+$/, '')}/${BLOG_DIR}/rss.xml`,
		pages: normalizeEntries(data.pages),
		posts: normalizePosts(data.posts),
		authors: normalizeEntries(data.authors),
		categories: normalizeEntries(data.categories),
	}
}

export async function getPostMarkdown(
	slugParts: string[],
): Promise<LlmsPostEntry | null> {
	const { slug, lang } = processPostMarkdownSlug(slugParts)
	const post = await client.fetch<SanityLlmsPost | null>(
		groq`*[
			_type == 'blog.post' &&
			metadata.noIndex != true &&
			metadata.slug.current == $slug
			${lang ? `&& language == '${lang}'` : ''}
		][0]{
			${POST_MARKDOWN_FIELDS}
			${POST_MARKDOWN_CONTENT_FIELDS}
			'url': (
				$baseUrl
				+ select(defined(language) && language != $defaultLang => language + '/', '')
				+ '${BLOG_DIR}/'
				+ metadata.slug.current
			)
		}`,
		{
			baseUrl: `${BASE_URL.replace(/\/+$/, '')}/`,
			defaultLang: DEFAULT_LANG,
			slug,
		},
		{
			perspective: 'published',
			useCdn: true,
		},
	)

	const [entry] = normalizePosts(post ? [post] : [])
	return entry || null
}

export async function getPageMarkdown(
	slugParts: string[],
): Promise<LlmsPageMarkdown | null> {
	const { slug, lang } = processMarkdownSlug(slugParts)
	const page = await client.fetch<SanityPageMarkdown | null>(
		groq`*[
			_type == 'page' &&
			metadata.noIndex != true &&
			metadata.slug.current == $slug &&
			length(markdown.code) > 0
			${lang ? `&& language == '${lang}'` : ''}
		][0]{
			'title': coalesce(metadata.title, title),
			'description': metadata.description,
			'updatedAt': _updatedAt,
			'content': markdown.code,
			'url': (
				$baseUrl
				+ select(defined(language) && language != $defaultLang => language + '/', '')
				+ select(metadata.slug.current == 'index' => '', metadata.slug.current)
			)
		}`,
		{
			baseUrl: `${BASE_URL.replace(/\/+$/, '')}/`,
			defaultLang: DEFAULT_LANG,
			slug,
		},
		{
			perspective: 'published',
			useCdn: true,
		},
	)

	if (!page?.title || !page.url || !page.content) return null

	return {
		title: page.title,
		url: page.url,
		description: page.description,
		updatedAt: page.updatedAt,
		content: page.content,
	}
}

export async function getPostMarkdownStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[
			_type == 'blog.post' &&
			defined(metadata.slug.current) &&
			metadata.noIndex != true
		].metadata.slug.current`,
	)

	return slugs.map((slug) => ({ slug: slug.split('/') }))
}

export async function getPageMarkdownStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[
			_type == 'page' &&
			defined(metadata.slug.current) &&
			metadata.noIndex != true &&
			length(markdown.code) > 0
		].metadata.slug.current`,
	)

	return slugs.map((slug) => ({
		slug: (slug === 'index' ? 'index' : slug).split('/'),
	}))
}

function normalizeEntries(entries: SanityLlmsEntry[] = []) {
	return entries
		.filter((entry) => entry.title && entry.url)
		.map((entry) => ({
			title: entry.title || '',
			url: entry.url || '',
			description: entry.description,
			updatedAt: entry.updatedAt,
		}))
}

function normalizePosts(posts: SanityLlmsPost[] = []): LlmsPostEntry[] {
	return posts
		.filter((post) => post.title && post.url)
		.filter((post) => isPublished(post.publishedAt))
		.map((post) => ({
			title: post.title || '',
			url: post.url || '',
			markdownUrl: toPostMarkdownUrl(post.url || ''),
			description: post.description,
			updatedAt: post.updatedAt,
			publishedAt: post.publishedAt,
			authors: post.authors?.filter(Boolean),
			categories: post.categories?.filter(Boolean),
			content: post.manualMarkdown || blogPostToMarkdown(post),
		}))
}

const POST_MARKDOWN_FIELDS = groq`
	'title': coalesce(metadata.title, title),
	'description': metadata.description,
	'publishedAt': publishDate,
	'updatedAt': _updatedAt,
	'authors': authors[]->name,
	'categories': categories[]->title,
`

const POST_MARKDOWN_CONTENT_FIELDS = groq`
	'manualMarkdown': markdown.code,
	youtubeEmbed,
	body[]{
		...,
		_type == 'image' => {
			...,
			'assetUrl': asset->url
		}
	},
	faq{
		items[]{
			summary,
			content[]
		}
	},
`

function isPublished(publishedAt?: string) {
	if (!publishedAt) return true

	const publishedDate = new Date(publishedAt)
	return Number.isNaN(publishedDate.getTime()) || publishedDate <= new Date()
}

function processPostMarkdownSlug(slugParts: string[]) {
	return processMarkdownSlug(slugParts)
}

function processMarkdownSlug(slugParts: string[]) {
	const parts = [...slugParts]
	const last = parts.at(-1)

	if (last?.endsWith('.md')) {
		parts[parts.length - 1] = last.slice(0, -'.md'.length)
	}

	const lang = languages.includes(parts[0]) ? parts.shift() : undefined

	return {
		slug: parts.join('/') || 'index',
		lang,
	}
}

function toPostMarkdownUrl(url: string) {
	if (!url) return undefined
	return `${url.replace(/\/+$/, '')}.md`
}
