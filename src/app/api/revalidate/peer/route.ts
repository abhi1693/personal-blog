import { normalizeTargets, revalidateTargets } from '@/lib/revalidation'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	const secret = process.env.SANITY_REVALIDATE_SECRET

	if (!secret) {
		return Response.json(
			{ error: 'SANITY_REVALIDATE_SECRET is not configured' },
			{ status: 500 },
		)
	}

	if (request.headers.get('authorization') !== `Bearer ${secret}`) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	let body: unknown
	try {
		body = await request.json()
	} catch {
		return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
	}

	const targets = normalizeTargets(
		typeof body === 'object' && body !== null && 'targets' in body
			? body.targets
			: undefined,
	)

	if (!targets.length) {
		return Response.json(
			{ error: 'No valid revalidation targets' },
			{ status: 400 },
		)
	}

	revalidateTargets(targets)

	return Response.json({
		revalidated: true,
		targets,
	})
}
