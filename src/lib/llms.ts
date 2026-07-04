export type LlmsEntry = {
	title: string
	url: string
	description?: string
	updatedAt?: string
}

export type LlmsPostEntry = LlmsEntry & {
	markdownUrl?: string
	publishedAt?: string
	authors?: string[]
	categories?: string[]
	content?: string
}

export type LlmsPageMarkdown = LlmsEntry & {
	content: string
}

export type LlmsIndex = {
	title: string
	description?: string
	baseUrl: string
	sitemapUrl: string
	rssUrl: string
	pages: LlmsEntry[]
	posts: LlmsPostEntry[]
	authors: LlmsEntry[]
	categories: LlmsEntry[]
}

export function formatRobotsTxt({
	baseUrl,
	disallow = ['/admin/', '/api/md/'],
}: {
	baseUrl: string
	disallow?: string[]
}) {
	const lines = [
		'User-agent: *',
		'Allow: /',
		...disallow.map((path) => `Disallow: ${path}`),
		'',
		'LLM-Policy: /llms.txt',
		`Sitemap: ${trimTrailingSlash(baseUrl)}/sitemap.xml`,
	]

	return `${lines.join('\n')}\n`
}

export function formatLlmsTxt(index: LlmsIndex) {
	const sections = [
		`# ${sanitizeLine(index.title)}`,
		index.description && `> ${sanitizeLine(index.description)}`,
		'',
		'## Site',
		`- [Homepage](${index.baseUrl})`,
		`- [Sitemap](${index.sitemapUrl})`,
		`- [RSS feed](${index.rssUrl})`,
		`- [Full content export](${trimTrailingSlash(index.baseUrl)}/llms-full.txt)`,
		`- [Page Markdown routes](${trimTrailingSlash(index.baseUrl)}/{slug}.md)`,
		`- [Post Markdown routes](${trimTrailingSlash(index.baseUrl)}/posts/{slug}.md)`,
		'',
		formatEntrySection('Key Pages', index.pages),
		formatPostSection('Blog Posts', index.posts),
		formatEntrySection('Authors', index.authors),
		formatEntrySection('Categories', index.categories),
		'## AI Crawler Access',
		'This site allows search and AI crawlers to access public content. Private admin routes are excluded in robots.txt.',
	]

	return `${sections.filter(Boolean).join('\n')}\n`
}

export function formatLlmsFullTxt(index: LlmsIndex) {
	const sections = [
		`# ${sanitizeLine(index.title)} Full Content`,
		index.description && `> ${sanitizeLine(index.description)}`,
		'',
		'## Site',
		`Homepage: ${index.baseUrl}`,
		`Sitemap: ${index.sitemapUrl}`,
		`RSS feed: ${index.rssUrl}`,
		'',
		formatFullEntries('Pages', index.pages),
		formatFullPosts(index.posts),
		formatFullEntries('Authors', index.authors),
		formatFullEntries('Categories', index.categories),
	]

	return `${sections.filter(Boolean).join('\n')}\n`
}

function formatEntrySection(title: string, entries: LlmsEntry[]) {
	if (!entries.length) return ''

	return [
		`## ${title}`,
		...entries.map((entry) => {
			const description = entry.description
				? `: ${sanitizeLine(entry.description)}`
				: ''
			return `- [${sanitizeLinkText(entry.title)}](${entry.url})${description}`
		}),
		'',
	].join('\n')
}

function formatPostSection(title: string, posts: LlmsPostEntry[]) {
	if (!posts.length) return ''

	return [
		`## ${title}`,
		...posts.map((post) => {
			const metadata = [
				post.publishedAt && `published ${formatDate(post.publishedAt)}`,
				post.authors?.length &&
					`by ${post.authors.map(sanitizeLine).join(', ')}`,
				post.categories?.length &&
					`in ${post.categories.map(sanitizeLine).join(', ')}`,
			].filter(Boolean)
			const suffix = metadata.length ? ` (${metadata.join('; ')})` : ''
			const description = post.description
				? `: ${sanitizeLine(post.description)}`
				: ''
			const markdown = post.markdownUrl
				? ` [Markdown](${post.markdownUrl})`
				: ''

			return `- [${sanitizeLinkText(post.title)}](${post.url})${description}${suffix}${markdown}`
		}),
		'',
	].join('\n')
}

function formatFullEntries(title: string, entries: LlmsEntry[]) {
	if (!entries.length) return ''

	return [
		`## ${title}`,
		...entries.map((entry) =>
			[
				`### [${sanitizeLinkText(entry.title)}](${entry.url})`,
				entry.description && sanitizeLine(entry.description),
				entry.updatedAt && `Last updated: ${formatDate(entry.updatedAt)}`,
				'',
			]
				.filter((line) => line !== undefined)
				.join('\n'),
		),
	].join('\n')
}

function formatFullPosts(posts: LlmsPostEntry[]) {
	if (!posts.length) return ''

	return [
		'## Blog Posts',
		...posts.map((post) =>
			[
				`### [${sanitizeLinkText(post.title)}](${post.url})`,
				post.description && sanitizeLine(post.description),
				post.publishedAt && `Published: ${formatDate(post.publishedAt)}`,
				post.updatedAt && `Last updated: ${formatDate(post.updatedAt)}`,
				post.authors?.length &&
					`Authors: ${post.authors.map(sanitizeLine).join(', ')}`,
				post.categories?.length &&
					`Categories: ${post.categories.map(sanitizeLine).join(', ')}`,
				post.markdownUrl && `Markdown: ${post.markdownUrl}`,
				post.content && '',
				post.content && sanitizeBody(post.content),
				'',
			]
				.filter((line) => line !== undefined && line !== 0)
				.join('\n'),
		),
	].join('\n')
}

export function formatPostMarkdown(post: LlmsPostEntry) {
	return [
		`# ${sanitizeLine(post.title)}`,
		post.description && `> ${sanitizeLine(post.description)}`,
		'',
		`Canonical: ${post.url}`,
		post.publishedAt && `Published: ${formatDate(post.publishedAt)}`,
		post.updatedAt && `Last updated: ${formatDate(post.updatedAt)}`,
		post.authors?.length &&
			`Authors: ${post.authors.map(sanitizeLine).join(', ')}`,
		post.categories?.length &&
			`Categories: ${post.categories.map(sanitizeLine).join(', ')}`,
		post.content && '',
		post.content && sanitizeBody(post.content),
	]
		.filter((line) => line !== undefined && line !== 0)
		.join('\n')
		.trim()
		.concat('\n')
}

export function formatPageMarkdown(page: LlmsPageMarkdown) {
	return [
		`# ${sanitizeLine(page.title)}`,
		page.description && `> ${sanitizeLine(page.description)}`,
		'',
		`Canonical: ${page.url}`,
		page.updatedAt && `Last updated: ${formatDate(page.updatedAt)}`,
		page.content && '',
		sanitizeBody(page.content),
	]
		.filter((line) => line !== undefined)
		.join('\n')
		.trim()
		.concat('\n')
}

function sanitizeLine(value: string) {
	return value
		.replace(/[\u0000-\u001f\u007f]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

function sanitizeLinkText(value: string) {
	return sanitizeLine(value).replace(/[[\]]/g, '')
}

function sanitizeBody(value: string) {
	return value
		.replace(/\r\n?/g, '\n')
		.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
}

function formatDate(value: string) {
	const date = new Date(value)
	return Number.isNaN(date.getTime())
		? sanitizeLine(value)
		: date.toISOString().slice(0, 10)
}

function trimTrailingSlash(value: string) {
	return value.replace(/\/+$/, '')
}
