import { BASE_URL } from '@/lib/env'
import { formatRobotsTxt } from '@/lib/llms'

export function GET() {
	return new Response(formatRobotsTxt({ baseUrl: BASE_URL }), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
		},
	})
}
