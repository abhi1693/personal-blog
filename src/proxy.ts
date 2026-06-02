import { DEFAULT_LANG, langCookieName } from './lib/i18n'
import { getTranslations } from './sanity/lib/queries'
import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const lang = request.cookies.get(langCookieName)?.value

	const postMarkdownPath = resolvePostMarkdownPath(pathname)
	if (postMarkdownPath) {
		const url = request.nextUrl.clone()
		url.pathname = postMarkdownPath
		return NextResponse.rewrite(url)
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
	const postPrefix = 'posts/'
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
