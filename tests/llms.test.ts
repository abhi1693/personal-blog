import {
	formatLlmsTxt,
	formatPostMarkdown,
	formatRobotsTxt,
	type LlmsIndex,
} from '../src/lib/llms'
import assert from 'assert'

const index: LlmsIndex = {
	title: 'Example [Blog]',
	description: 'Notes\nfor builders',
	baseUrl: 'https://example.com',
	sitemapUrl: 'https://example.com/sitemap.xml',
	rssUrl: 'https://example.com/posts/rss.xml',
	pages: [
		{
			title: 'About [Me]',
			url: 'https://example.com/about',
			description: 'Profile\nand work',
		},
	],
	posts: [
		{
			title: 'AI Crawlers',
			url: 'https://example.com/posts/ai-crawlers',
			markdownUrl: 'https://example.com/posts/ai-crawlers.md',
			description: 'How to support AI crawlers',
			publishedAt: '2026-06-02T00:00:00.000Z',
			authors: ['Abhimanyu'],
			categories: ['SEO'],
		},
	],
	authors: [],
	categories: [],
}

assert.strictEqual(
	formatRobotsTxt({ baseUrl: 'https://example.com/' }),
	[
		'User-agent: *',
		'Allow: /',
		'Disallow: /admin/',
		'Disallow: /posts-md/',
		'',
		'LLM-Policy: /llms.txt',
		'Sitemap: https://example.com/sitemap.xml',
		'',
	].join('\n'),
)

const llms = formatLlmsTxt(index)
assert.ok(llms.includes('# Example [Blog]'))
assert.ok(llms.includes('> Notes for builders'))
assert.ok(
	llms.includes('- [About Me](https://example.com/about): Profile and work'),
)
assert.ok(
	llms.includes(
		'- [AI Crawlers](https://example.com/posts/ai-crawlers): How to support AI crawlers (published 2026-06-02; by Abhimanyu; in SEO) [Markdown](https://example.com/posts/ai-crawlers.md)',
	),
)

const postMarkdown = formatPostMarkdown({
	title: 'AI Crawlers',
	url: 'https://example.com/posts/ai-crawlers',
	description: 'How to support AI crawlers',
	publishedAt: '2026-06-02T00:00:00.000Z',
	updatedAt: '2026-06-03T00:00:00.000Z',
	authors: ['Abhimanyu'],
	categories: ['SEO'],
	content: '## Body\n\nMarkdown content.',
})

assert.ok(postMarkdown.startsWith('# AI Crawlers\n'))
assert.ok(
	postMarkdown.includes('Canonical: https://example.com/posts/ai-crawlers'),
)
assert.ok(postMarkdown.includes('Published: 2026-06-02'))
assert.ok(postMarkdown.includes('## Body\n\nMarkdown content.'))

console.log('llms tests passed')
