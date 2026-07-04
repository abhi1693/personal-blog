import { formatPageMarkdown, formatPostMarkdown } from '@/lib/llms'
import { getPageMarkdown, getPostMarkdown } from '@/lib/llms-data'
import { BLOG_DIR } from '@/lib/env'
import { languages } from '@/lib/i18n'

export const revalidate = 3600

type Props = {
	params: Promise<{
		slug: string[]
	}>
}

export async function GET(_request: Request, { params }: Props) {
	const slug = (await params).slug
	const postSlug = getPostSlug(slug)

	if (postSlug) {
		const post = await getPostMarkdown(postSlug)

		if (post) {
			return markdownResponse(formatPostMarkdown(post))
		}
	} else {
		const page = await getPageMarkdown(slug)

		if (page) {
			return markdownResponse(formatPageMarkdown(page))
		}
	}

	return new Response('Markdown not found\n', {
		status: 404,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	})
}

function markdownResponse(body: string) {
	return new Response(body, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
		},
	})
}

function getPostSlug(slug: string[]) {
	const blogDirIndex = getBlogDirIndex(slug)
	if (blogDirIndex === undefined) return undefined

	const languagePrefix = slug.slice(0, blogDirIndex)
	const postSlug = slug.slice(blogDirIndex + 1)
	if (!postSlug.length || postSlug[0] === 'category') return undefined

	return [...languagePrefix, ...postSlug]
}

function getBlogDirIndex(slug: string[]) {
	if (slug[0] === BLOG_DIR) return 0
	if (slug[1] === BLOG_DIR && languages.includes(slug[0])) return 1

	return undefined
}
