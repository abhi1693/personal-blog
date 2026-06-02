import { formatLlmsFullTxt } from '@/lib/llms'
import { getLlmsIndex } from '@/lib/llms-data'

export const revalidate = 3600

export async function GET() {
	const index = await getLlmsIndex({ includeContent: true })

	return new Response(formatLlmsFullTxt(index), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
		},
	})
}
