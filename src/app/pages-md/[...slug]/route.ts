import { formatPageMarkdown } from '@/lib/llms'
import { getPageMarkdown, getPageMarkdownStaticParams } from '@/lib/llms-data'

export const revalidate = 3600

type Props = {
	params: Promise<{
		slug: string[]
	}>
}

export async function GET(_request: Request, { params }: Props) {
	const page = await getPageMarkdown((await params).slug)

	if (!page) {
		return new Response('Page not found\n', {
			status: 404,
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
		})
	}

	return new Response(formatPageMarkdown(page), {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
		},
	})
}

export async function generateStaticParams() {
	return getPageMarkdownStaticParams()
}
