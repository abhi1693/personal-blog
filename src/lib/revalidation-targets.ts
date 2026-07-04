import { BLOG_DIR } from './env'
import { DEFAULT_LANG } from './i18n'

export type RevalidationTarget = {
	path: string
	type?: 'layout' | 'page'
}

type SanityWebhookBody = {
	_type?: unknown
	language?: unknown
	metadata?: {
		slug?: {
			current?: unknown
		}
	}
	slug?: unknown
	categories?: unknown
}

export function normalizeTargets(input: unknown): RevalidationTarget[] {
	if (!Array.isArray(input)) return []

	const targets = new Map<string, RevalidationTarget>()

	for (const target of input) {
		if (!isRecord(target) || typeof target.path !== 'string') continue
		if (!target.path.startsWith('/')) continue
		if (
			target.type !== undefined &&
			target.type !== 'page' &&
			target.type !== 'layout'
		)
			continue

		const key = `${target.path}:${target.type ?? ''}`
		targets.set(
			key,
			target.type
				? { path: target.path, type: target.type }
				: { path: target.path },
		)
	}

	return [...targets.values()]
}

export function getSanityRevalidationTargets(
	body: SanityWebhookBody | null,
): RevalidationTarget[] {
	const targets = new Map<string, RevalidationTarget>()
	const add = (target: RevalidationTarget) => {
		const key = `${target.path}:${target.type ?? ''}`
		targets.set(key, target)
	}

	add({ path: '/' })
	add({ path: `/${BLOG_DIR}` })
	add({ path: `/${BLOG_DIR}/rss.xml` })
	add({ path: '/llms.txt' })
	add({ path: '/llms-full.txt' })
	add({ path: '/sitemap.xml' })

	if (!body) return [...targets.values()]

	const type = typeof body._type === 'string' ? body._type : undefined

	if (type === 'blog.post') {
		add({ path: `/${BLOG_DIR}/[...slug]`, type: 'page' })
		add({ path: `/${BLOG_DIR}/category/[slug]`, type: 'page' })

		const slug = getDocumentSlug(body)
		const language =
			typeof body.language === 'string' ? body.language : undefined

		if (slug) {
			add({ path: `/${BLOG_DIR}/${slug}` })
			add({ path: `/${BLOG_DIR}/${slug}.md` })

			if (language && language !== DEFAULT_LANG) {
				add({ path: `/${language}/${BLOG_DIR}/${slug}` })
				add({ path: `/${language}/${BLOG_DIR}/${slug}.md` })
				add({ path: `/${BLOG_DIR}/${language}/${slug}` })
				add({ path: `/${BLOG_DIR}/${language}/${slug}.md` })
			}
		}

		for (const categorySlug of getCategorySlugs(body.categories)) {
			add({ path: `/${BLOG_DIR}/category/${categorySlug}` })
		}
	}

	if (type === 'blog.category') {
		add({ path: `/${BLOG_DIR}/category/[slug]`, type: 'page' })

		const slug = getDocumentSlug(body)
		if (slug) add({ path: `/${BLOG_DIR}/category/${slug}` })
	}

	if (type === 'page') {
		const slug = getDocumentSlug(body)
		const language =
			typeof body.language === 'string' ? body.language : undefined

		if (slug) {
			add({ path: slug === 'index' ? '/' : `/${slug}` })
			add({ path: slug === 'index' ? '/index.md' : `/${slug}.md` })

			if (language && language !== DEFAULT_LANG) {
				add({
					path: slug === 'index' ? `/${language}` : `/${language}/${slug}`,
				})
				add({ path: `/${language}/${slug === 'index' ? 'index' : slug}.md` })
			}
		}
	}

	return [...targets.values()]
}

function getDocumentSlug(body: SanityWebhookBody) {
	return (
		normalizeSlug(body.metadata?.slug?.current) ??
		normalizeSlug(getCurrentValue(body.slug)) ??
		normalizeSlug(body.slug)
	)
}

function getCategorySlugs(categories: unknown) {
	if (!Array.isArray(categories)) return []

	return categories
		.map((category) => {
			if (typeof category === 'string') return normalizeSlug(category)
			if (!isRecord(category)) return undefined

			return (
				normalizeSlug(getCurrentValue(category.slug)) ??
				normalizeSlug(category.slug)
			)
		})
		.filter((slug): slug is string => !!slug)
}

function getCurrentValue(value: unknown) {
	if (!isRecord(value)) return undefined
	return value.current
}

function normalizeSlug(value: unknown) {
	if (typeof value !== 'string') return undefined

	const slug = value.trim().replace(/^\/+|\/+$/g, '')
	return slug.length ? slug : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}
