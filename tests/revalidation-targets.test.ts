import {
	getSanityRevalidationTargets,
	normalizeTargets,
} from '../src/lib/revalidation-targets'
import assert from 'assert'

const postTargets = getSanityRevalidationTargets({
	_type: 'blog.post',
	slug: 'new-post',
	categories: ['kubernetes', { slug: { current: 'infra' } }],
})

assert.deepStrictEqual(postTargets, [
	{ path: '/' },
	{ path: '/posts' },
	{ path: '/posts/rss.xml' },
	{ path: '/llms.txt' },
	{ path: '/llms-full.txt' },
	{ path: '/sitemap.xml' },
	{ path: '/posts/[...slug]', type: 'page' },
	{ path: '/posts/category/[slug]', type: 'page' },
	{ path: '/posts/new-post' },
	{ path: '/posts/new-post.md' },
	{ path: '/api/md/posts/new-post' },
	{ path: '/posts/category/kubernetes' },
	{ path: '/posts/category/infra' },
])

const pageTargets = getSanityRevalidationTargets({
	_type: 'page',
	metadata: { slug: { current: 'index' } },
})

assert.ok(pageTargets.some((target) => target.path === '/'))
assert.ok(pageTargets.some((target) => target.path === '/index.md'))
assert.ok(pageTargets.some((target) => target.path === '/api/md/index'))
assert.ok(!pageTargets.some((target) => target.path === '/index'))

assert.deepStrictEqual(
	normalizeTargets([
		{ path: '/posts/example' },
		{ path: '/posts/example' },
		{ path: '/posts/[...slug]', type: 'page' },
		{ path: 'relative' },
		{ path: '/bad-type', type: 'route' },
	]),
	[{ path: '/posts/example' }, { path: '/posts/[...slug]', type: 'page' }],
)

console.log('revalidation target tests passed')
