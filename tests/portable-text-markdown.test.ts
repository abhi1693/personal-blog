import { blogPostToMarkdown } from '../src/lib/portableTextMarkdown'
import assert from 'assert'

const markdown = blogPostToMarkdown({
	youtubeEmbed: { videoID: 'abc123', title: 'Demo Video' },
	body: [
		{
			_type: 'block',
			style: 'h2',
			children: [{ _type: 'span', text: 'Heading', marks: [] }],
			markDefs: [],
		},
		{
			_type: 'block',
			children: [
				{ _type: 'span', text: 'Read ', marks: [] },
				{ _type: 'span', text: 'this', marks: ['link'] },
			],
			markDefs: [{ _key: 'link', _type: 'link', href: 'https://example.com' }],
		},
		{
			_type: 'image',
			alt: 'Architecture diagram',
			caption: 'System overview',
			source: 'https://example.com/source',
			assetUrl: 'https://cdn.example.com/image.png',
		},
		{
			_type: 'admonition',
			tone: 'tip',
			title: 'Remember',
			content: [
				{
					_type: 'block',
					children: [{ _type: 'span', text: 'Use markdown.', marks: [] }],
					markDefs: [],
				},
			],
		},
		{
			_type: 'code',
			filename: 'src/app.ts',
			language: 'ts',
			code: 'export const ok = true',
		},
		{
			_type: 'custom-html',
			html: { code: '<table><tr><td>Metric</td></tr></table>' },
			css: { code: 'table { width: 100%; }' },
		},
	],
	faq: {
		items: [
			{
				summary: 'Does FAQ render?',
				content: [
					{
						_type: 'block',
						children: [{ _type: 'span', text: 'Yes.', marks: [] }],
						markDefs: [],
					},
				],
			},
		],
	},
})

assert.ok(
	markdown.includes('[Demo Video](https://www.youtube.com/watch?v=abc123)'),
)
assert.ok(markdown.includes('## Heading'))
assert.ok(markdown.includes('[this](https://example.com)'))
assert.ok(
	markdown.includes(
		'![Architecture diagram](https://cdn.example.com/image.png)',
	),
)
assert.ok(
	markdown.includes('_System overview [Source](https://example.com/source)_'),
)
assert.ok(markdown.includes('> TIP: Remember'))
assert.ok(markdown.includes('File: src/app.ts'))
assert.ok(markdown.includes('```ts\nexport const ok = true\n```'))
assert.ok(
	markdown.includes('```html\n<table><tr><td>Metric</td></tr></table>\n```'),
)
assert.ok(markdown.includes('```css\ntable { width: 100%; }\n```'))
assert.ok(markdown.includes('## FAQ'))
assert.ok(markdown.includes('### Does FAQ render?'))

console.log('portable text markdown tests passed')
