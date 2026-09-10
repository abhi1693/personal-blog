import {
	createBlogFeedResponse,
	type BlogFeedData,
	type BlogFeedPost,
} from '../src/lib/blog-feed'
import assert from 'node:assert/strict'
import test from 'node:test'
import Parser from 'rss-parser'

const { parseStringPromise } = require('xml2js')
const atomNamespace = 'http://www.w3.org/2005/Atom'
const now = new Date('2026-09-10T12:00:00Z')
const post: BlogFeedPost = {
	id: 'https://project.api.sanity.io/v1/data/doc/production/post-1',
	url: 'https://example.com/posts/original-slug',
	title: 'DevOps & <Kubernetes> "tips" ]]> 🛠',
	description: 'A <script> is text & so are entities like &copy;.',
	content:
		'<p>Read <a href="https://example.com/?a=1&amp;b=2">more</a>.</p><pre><code>&lt;script&gt;</code></pre>',
	published: '2026-06-02',
	updated: '2026-09-08T15:30:00+05:30',
	authors: [{ name: 'Abhimanyu & contributors' }],
}
const data: BlogFeedData = {
	title: 'Engineering & operations',
	description: 'Notes on <infrastructure> & automation',
	url: 'https://example.com/posts',
	baseUrl: 'https://example.com',
	rssUrl: 'https://example.com/posts/rss.xml',
	atomUrl: 'https://example.com/posts/atom.xml',
	updated: '2025-05-23T14:18:05Z',
	siteUpdated: '2025-08-24T03:39:38Z',
	author: 'Abhimanyu Saharan',
	copyright: '© Abhimanyu Saharan',
	language: 'en',
	posts: [post],
}

async function parseAtom(input = data, at = now) {
	const response = createBlogFeedResponse(input, 'atom', at)
	assert.equal(response.status, 200)
	assert.equal(
		response.headers.get('Content-Type'),
		'application/atom+xml; charset=utf-8',
	)
	const xml = await response.text()
	const { feed } = await parseStringPromise(xml, { xmlns: true })
	assert.equal(feed.$ns.uri, atomNamespace)
	for (const container of [feed, ...(feed.entry || [])]) {
		for (const name of ['id', 'title', 'updated']) {
			assert.equal(container[name].length, 1, `Exactly one ${name} is required`)
			assert.equal(container[name][0].$ns.uri, atomNamespace)
		}
		assert.ok(new URL(container.id[0]._).protocol)
		assert.match(
			container.updated[0]._,
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
		)
		assert.ok(
			(container.author || feed.author).some((author: any) => author.name[0]._),
		)
	}
	return { feed, xml }
}

test('Atom has the required namespace, metadata, links, authors and separate timestamps', async () => {
	const { feed } = await parseAtom()
	assert.equal(feed.title[0]._, data.title)
	assert.equal(feed.subtitle[0]._, data.description)
	assert.equal(feed.author[0].name[0]._, data.author)
	assert.equal(feed.updated[0]._, '2026-09-08T10:00:00.000Z')
	const self = feed.link.filter((link: any) => link.$.rel.value === 'self')
	assert.equal(self.length, 1)
	assert.equal(self[0].$.href.value, data.atomUrl)
	const entry = feed.entry[0]
	assert.equal(entry.id[0]._, post.id)
	assert.equal(entry.link[0].$.href.value, post.url)
	assert.equal(entry.published[0]._, '2026-06-02T00:00:00.000Z')
	assert.equal(entry.updated[0]._, '2026-09-08T10:00:00.000Z')
	assert.equal(entry.author[0].name[0]._, post.authors![0]!.name)
	assert.equal(entry.title[0].$.type.value, 'html')
	assert.equal(
		entry.title[0]._,
		'DevOps &amp; &lt;Kubernetes&gt; &quot;tips&quot; ]]&gt; 🛠',
	)
	assert.equal(
		entry.summary[0]._,
		'A &lt;script&gt; is text &amp; so are entities like &amp;copy;.',
	)
	assert.equal(entry.content[0].$.type.value, 'html')
	assert.equal(entry.content[0]._, post.content)
	assert.equal(
		entry.content[0].p,
		undefined,
		'HTML must be XML text, not child elements',
	)
})

test('Atom IDs and timestamps remain stable across requests and slug changes', async () => {
	const first = await parseAtom()
	const later = await parseAtom(data, new Date('2026-09-11T12:00:00Z'))
	assert.equal(first.xml, later.xml)
	const renamed = await parseAtom({
		...data,
		posts: [{ ...post, url: 'https://example.com/posts/new-slug' }],
	})
	assert.equal(first.feed.entry[0].id[0]._, renamed.feed.entry[0].id[0]._)
	assert.equal(
		renamed.feed.entry[0].link[0].$.href.value,
		'https://example.com/posts/new-slug',
	)
})

test('future and invalid publication dates are excluded in both formats', async () => {
	const input = {
		...data,
		posts: [
			post,
			{
				...post,
				id: 'https://example.com/future',
				published: '2026-09-11',
				updated: '2026-09-11',
			},
			{ ...post, published: 'invalid' },
			{ ...post, published: '' },
		],
	}
	const { feed } = await parseAtom(input)
	assert.equal(feed.entry.length, 1)
	assert.equal(feed.updated[0]._, '2026-09-08T10:00:00.000Z')
	const rss = await new Parser().parseString(
		await createBlogFeedResponse(input, 'rss', now).text(),
	)
	assert.equal(rss.items.length, 1)
})

test('missing authors inherit the feed author and missing update times use publication', async () => {
	for (const authors of [undefined, [], [null, {}, { name: '  ' }]]) {
		for (const updated of [undefined, 'invalid', '2025-01-01']) {
			const { feed } = await parseAtom({
				...data,
				posts: [
					{ ...post, authors, updated, content: '', description: undefined },
				],
			})
			const entry = feed.entry[0]
			assert.equal(entry.author, undefined)
			assert.equal(entry.updated[0]._, entry.published[0]._)
			assert.equal(entry.content, undefined)
			assert.equal(entry.link[0].$.href.value, post.url)
		}
	}
})

test('empty feeds retain required metadata and content-based update times', async () => {
	const { feed } = await parseAtom({ ...data, posts: [] })
	assert.equal(feed.entry, undefined)
	assert.equal(feed.updated[0]._, '2025-08-24T03:39:38.000Z')
	const changed = await parseAtom({
		...data,
		siteUpdated: '2026-09-09T00:00:00Z',
	})
	assert.equal(changed.feed.updated[0]._, '2026-09-09T00:00:00.000Z')
	const missingDates = await parseAtom({
		...data,
		posts: [],
		updated: undefined,
		siteUpdated: undefined,
	})
	assert.equal(missingDates.feed.updated[0]._, '1970-01-01T00:00:00.000Z')
})

test('RSS preserves GUIDs, publication dates and text titles without an email-less author', async () => {
	const response = createBlogFeedResponse(data, 'rss', now)
	assert.equal(
		response.headers.get('Content-Type'),
		'application/rss+xml; charset=utf-8',
	)
	const xml = await response.text()
	const { rss } = await parseStringPromise(xml)
	assert.equal(rss.$.version, '2.0')
	const channel = rss.channel[0]
	const self = channel['atom:link'].filter((link: any) => link.$.rel === 'self')
	assert.equal(self.length, 1)
	assert.equal(self[0].$.href, data.rssUrl)
	assert.equal(self[0].$.type, 'application/rss+xml')
	assert.equal(channel.lastBuildDate[0], 'Tue, 08 Sep 2026 10:00:00 GMT')
	const item = channel.item[0]
	assert.equal(item.title[0], post.title)
	assert.equal(item.guid[0]._, post.url)
	assert.equal(item.pubDate[0], 'Tue, 02 Jun 2026 00:00:00 GMT')
	assert.equal(item.author, undefined)
	assert.equal(item['dc:creator'][0], post.authors![0]!.name)
	assert.equal(item['content:encoded'][0], post.content)
	// The newsletter uses this parser and must still see the original publication date.
	const parsed = await new Parser().parseString(xml)
	assert.equal(parsed.items[0].title, post.title)
	assert.equal(parsed.items[0].isoDate, '2026-06-02T00:00:00.000Z')
})

test('RSS provides a summary and creator namespace even without article content', async () => {
	const xml = await createBlogFeedResponse(
		{
			...data,
			posts: [{ ...post, content: '', description: '', authors: [] }],
		},
		'rss',
		now,
	).text()
	const { rss } = await parseStringPromise(xml, { xmlns: true })
	assert.equal(
		rss.channel[0].item[0]['dc:creator'][0].$ns.uri,
		'http://purl.org/dc/elements/1.1/',
	)
	assert.equal(rss.channel[0].item[0]['dc:creator'][0]._, data.author)
	assert.ok(rss.channel[0].item[0].description[0]._)
})
