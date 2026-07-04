import { BLOG_DIR } from './lib/env'
import { DEFAULT_LANG, langCookieName, languages } from './lib/i18n'
import { getTranslations } from './sanity/lib/queries'
import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'

const AI_CRAWLER =
	/bot|crawl|spider|gptbot|claudebot|claude-web|anthropic|chatgpt|oai-searchbot|perplexity|ccbot|google-extended/i

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const lang = request.cookies.get(langCookieName)?.value

	const markdownPath = resolveMarkdownPath(
		pathname,
		request.headers.get('accept'),
		request.headers.get('user-agent'),
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
	matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
}

function resolveMarkdownPath(
	pathname: string,
	acceptHeader: string | null,
	userAgentHeader: string | null,
) {
	const wantsMarkdown =
		acceptHeader?.includes('text/markdown') ||
		AI_CRAWLER.test(userAgentHeader ?? '')
	if (!wantsMarkdown) return undefined

	const path = trimPath(pathname)
	if (hasFileExtension(path)) return undefined
	if (isBlogCategoryPath(path)) return undefined

	return {
		pathname: `/api/md/${path || 'index'}`,
		vary: 'Accept, User-Agent',
	}
}

function isBlogCategoryPath(path: string) {
	if (!path) return false
	const parts = path.split('/')
	const blogDirIndex = getBlogDirIndex(parts)
	if (blogDirIndex === undefined) return false

	return parts[blogDirIndex + 1] === 'category'
}

function getBlogDirIndex(parts: string[]) {
	if (parts[0] === BLOG_DIR) return 0
	if (parts[1] === BLOG_DIR && languages.includes(parts[0])) return 1

	return undefined
}

function trimPath(pathname: string) {
	return pathname.replace(/^\/+|\/+$/g, '')
}

function hasFileExtension(path: string) {
	if (!path) return false
	return /\.[^/]+$/.test(path)
}
