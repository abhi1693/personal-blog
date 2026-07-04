import { BLOG_DIR } from './lib/env'
import { DEFAULT_LANG, langCookieName } from './lib/i18n'
import { getTranslations } from './sanity/lib/queries'
import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const lang = request.cookies.get(langCookieName)?.value

	const markdownPath = resolveMarkdownPath(
		pathname,
		request.headers.get('accept'),
	)
	if (markdownPath) {
		const url = request.nextUrl.clone()
		url.pathname = markdownPath.pathname
		const response = NextResponse.rewrite(url)

		if (markdownPath.vary) {
			response.headers.append('Vary', markdownPath.vary)
		}

		return response
	}

	const T = await getTranslations()

	const isPrefixed = !!T.find((t) =>
		t.translations?.some(({ slug }) => slug === pathname),
	)

	if (!request.cookies.has(langCookieName) && !isPrefixed)
		return NextResponse.next()

	const available = T?.find((t) =>
		[t.slug, ...(t.translations?.map(({ slug }) => slug) ?? [])].includes(
			pathname,
		),
	)
	if (!available) return NextResponse.next()

	const cookieMatchesCurrentPrefix =
		// cookie matches current prefix
		lang ===
			available.translations?.find((t) =>
				[t.slugBlogAlt, t.slug].includes(pathname),
			)?.language ||
		// default language and current path is the base path
		(lang === DEFAULT_LANG && pathname === available.slug)

	if (!cookieMatchesCurrentPrefix) {
		const target = available.translations?.find((t) => t.language === lang)
		// use base path for default language
		const url =
			target?.language === DEFAULT_LANG
				? available.slug
				: (target?.slugBlogAlt ?? target?.slug)
		if (!url) return NextResponse.next()

		return NextResponse.redirect(new URL(url, request.url))
	}

	return NextResponse.next()
}

export const config: ProxyConfig = {
	matcher: ['/((?!favicon.ico|_next|api|admin).*)'],
}

function resolvePostMarkdownPath(pathname: string) {
	const match = pathname.match(/^\/(.+)\.md$/)
	if (!match) return undefined

	const path = match[1]
	const postPrefix = `${BLOG_DIR}/`
	const postIndex = path.indexOf(postPrefix)
	if (postIndex === -1) return undefined

	const beforePostPrefix = path.slice(0, postIndex)
	if (beforePostPrefix && !beforePostPrefix.endsWith('/')) return undefined

	const slug = path.slice(postIndex + postPrefix.length)
	if (!slug || slug.startsWith('category/')) return undefined

	const languagePrefix = beforePostPrefix.replace(/\/$/, '')
	const markdownSlug = [languagePrefix, slug].filter(Boolean).join('/')

	return `/posts-md/${markdownSlug}`
}

function resolveMarkdownPath(pathname: string, acceptHeader: string | null) {
	const postMarkdownPath = resolvePostMarkdownPath(pathname)
	if (postMarkdownPath) return { pathname: postMarkdownPath }

	const pageMarkdownPath = resolvePageMarkdownPath(pathname)
	if (pageMarkdownPath) return { pathname: pageMarkdownPath }

	if (!acceptHeader?.includes('text/markdown')) return undefined

	const postPath = resolvePostPath(pathname)
	if (postPath) return { pathname: postPath, vary: 'Accept' }

	const pagePath = resolvePagePath(pathname)
	if (pagePath) return { pathname: pagePath, vary: 'Accept' }

	return undefined
}

function resolvePageMarkdownPath(pathname: string) {
	const match = pathname.match(/^\/(.+)\.md$/)
	if (!match) return undefined

	const path = match[1]
	if (!path || hasFileExtension(path)) return undefined

	return `/pages-md/${path}`
}

function resolvePostPath(pathname: string) {
	const path = trimPath(pathname)
	const postPrefix = `${BLOG_DIR}/`
	const postIndex = path.indexOf(postPrefix)

	if (postIndex === -1) return undefined

	const beforePostPrefix = path.slice(0, postIndex)
	if (beforePostPrefix && !beforePostPrefix.endsWith('/')) return undefined

	const slug = path.slice(postIndex + postPrefix.length)
	if (!slug || slug.startsWith('category/')) return undefined

	const languagePrefix = beforePostPrefix.replace(/\/$/, '')
	const markdownSlug = [languagePrefix, slug].filter(Boolean).join('/')

	return `/posts-md/${markdownSlug}`
}

function resolvePagePath(pathname: string) {
	const path = trimPath(pathname)
	if (!path) return '/pages-md/index'
	if (path.startsWith(`${BLOG_DIR}/`) || path.includes(`/${BLOG_DIR}/`)) {
		return undefined
	}
	if (hasFileExtension(path)) return undefined

	return `/pages-md/${path}`
}

function trimPath(pathname: string) {
	return pathname.replace(/^\/+|\/+$/g, '')
}

function hasFileExtension(path: string) {
	return /\.[^/]+$/.test(path)
}
