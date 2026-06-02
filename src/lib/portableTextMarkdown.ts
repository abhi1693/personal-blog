import { portableTextToMarkdown } from '@portabletext/markdown'

type BlogPostMarkdownInput = {
	body?: PortableTextNode[]
	youtubeEmbed?: {
		videoID?: string
		videoId?: string
		title?: string
	}
	faq?: {
		items?: Array<{
			summary?: string
			content?: PortableTextNode[]
		}>
	}
}

type PortableTextNode = {
	_type: string
	_key?: string
	[key: string]: any
}

export function blogPostToMarkdown(post: BlogPostMarkdownInput) {
	const sections = [
		youtubeEmbedToMarkdown(post.youtubeEmbed),
		portableTextToMarkdown(post.body || [], {
			types: {
				admonition: ({ value }) => admonitionToMarkdown(value),
				code: ({ value }) => codeToMarkdown(value),
				'custom-html': ({ value }) => customHtmlToMarkdown(value),
				image: ({ value }) => imageToMarkdown(value),
			},
		}),
		faqToMarkdown(post.faq),
	]

	return sections
		.map((section) => section?.trim())
		.filter(Boolean)
		.join('\n\n')
}

function youtubeEmbedToMarkdown(embed: BlogPostMarkdownInput['youtubeEmbed']) {
	const videoId = embed?.videoID || embed?.videoId
	if (!videoId) return ''

	const title = embed?.title || 'YouTube video'
	return `[${escapeMarkdownText(title)}](https://www.youtube.com/watch?v=${encodeURIComponent(videoId)})`
}

function admonitionToMarkdown(value: {
	tone?: string
	title?: string
	content?: PortableTextNode[]
}) {
	const heading = [value.tone?.toUpperCase(), value.title]
		.filter(Boolean)
		.join(': ')
	const content = portableTextToMarkdown(value.content || []).trim()

	return [`> ${escapeMarkdownText(heading || 'Note')}`, quoteMarkdown(content)]
		.filter(Boolean)
		.join('\n')
}

function codeToMarkdown(value: {
	code?: string
	language?: string
	filename?: string
}) {
	if (!value.code) return ''

	const language = sanitizeFenceInfo(value.language || '')
	const fence = getFence(value.code)
	const filename = value.filename
		? `File: ${escapeMarkdownText(value.filename)}\n\n`
		: ''

	return `${filename}${fence}${language}\n${value.code}\n${fence}`
}

function customHtmlToMarkdown(value: {
	html?: { code?: string }
	css?: { code?: string }
}) {
	const sections = [
		value.html?.code && fencedCode(value.html.code, 'html'),
		value.css?.code && fencedCode(value.css.code, 'css'),
	]

	return sections.filter(Boolean).join('\n\n')
}

function imageToMarkdown(value: {
	alt?: string
	caption?: string
	source?: string
	assetUrl?: string
	asset?: {
		url?: string
	}
}) {
	const url = value.assetUrl || value.asset?.url
	if (!url) return ''

	const alt = escapeMarkdownText(value.alt || value.caption || 'Image')
	const caption = value.caption ? escapeMarkdownText(value.caption) : ''
	const source = value.source ? `[Source](${value.source})` : ''
	const details = [caption, source].filter(Boolean).join(' ')

	return [`![${alt}](${url})`, details && `_${details}_`]
		.filter(Boolean)
		.join('\n')
}

function faqToMarkdown(faq: BlogPostMarkdownInput['faq']) {
	const items = faq?.items?.filter((item) => item.summary) || []
	if (!items.length) return ''

	return [
		'## FAQ',
		...items.map((item) =>
			[
				`### ${escapeMarkdownText(item.summary || '')}`,
				portableTextToMarkdown(item.content || []).trim(),
			]
				.filter(Boolean)
				.join('\n\n'),
		),
	].join('\n\n')
}

function fencedCode(code: string, language: string) {
	const fence = getFence(code)
	return `${fence}${sanitizeFenceInfo(language)}\n${code}\n${fence}`
}

function getFence(code: string) {
	const longestFence = code
		.match(/`{3,}/g)
		?.sort((a, b) => b.length - a.length)[0]
	return longestFence ? `${longestFence}\`` : '```'
}

function quoteMarkdown(value: string) {
	if (!value) return ''

	return value
		.split('\n')
		.map((line) => (line ? `> ${line}` : '>'))
		.join('\n')
}

function sanitizeFenceInfo(value: string) {
	return value.replace(/[` \t\r\n]/g, '')
}

function escapeMarkdownText(value: string) {
	return value
		.replace(/([\\[\]])/g, '\\$1')
		.replace(/\s+/g, ' ')
		.trim()
}
