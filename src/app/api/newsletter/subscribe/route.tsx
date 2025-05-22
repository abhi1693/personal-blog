import { isValidEmail, sanitizeText } from '@/lib/validation'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY_FULL)

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const rateLimitMap = new Map<string, { count: number; time: number }>()
const MAX_BODY_SIZE = 4096

export const POST = async (req: Request) => {
	if (req.method !== 'POST') {
		return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
		})
	}

	const ip =
		req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	const now = Date.now()
	const entry = rateLimitMap.get(ip)
	if (entry && now - entry.time < RATE_LIMIT_WINDOW_MS) {
		if (entry.count >= RATE_LIMIT_MAX) {
			return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
				status: 429,
			})
		}
		entry.count++
	} else {
		rateLimitMap.set(ip, { count: 1, time: now })
	}

	const contentType = req.headers.get('content-type')
	if (!contentType?.includes('application/json')) {
		return new NextResponse(JSON.stringify({ error: 'Invalid content-type' }), {
			status: 400,
		})
	}

	const rawBody = await req.text()
	if (rawBody.length > MAX_BODY_SIZE) {
		return new NextResponse(JSON.stringify({ error: 'Payload too large' }), {
			status: 413,
		})
	}
	let body: any
	try {
		body = JSON.parse(rawBody)
	} catch {
		return new NextResponse(
			JSON.stringify({ error: 'Request body must be valid JSON' }),
			{ status: 400 },
		)
	}

	const rawEmail = typeof body.email === 'string' ? body.email.trim() : ''
	const email = rawEmail.toLowerCase()
	const firstName =
		typeof body.firstName === 'string'
			? sanitizeText(body.firstName)
			: undefined
	const lastName =
		typeof body.lastName === 'string' ? sanitizeText(body.lastName) : undefined

	if (!isValidEmail(email)) {
		return new NextResponse(
			JSON.stringify({ error: 'Valid email is required.' }),
			{
				status: 400,
			},
		)
	}

	try {
		const { error } = await resend.contacts.create({
			email,
			audienceId: process.env.NEXT_RESEND_AUDIENCE_ID!,
			firstName,
			lastName,
		})

		if (error) {
			const alreadyExists = error.message?.includes('already exists')
			return new NextResponse(
				JSON.stringify({
					message: alreadyExists
						? 'Already subscribed.'
						: 'Failed to subscribe.',
				}),
				{ status: alreadyExists ? 200 : 500 },
			)
		}

		return new NextResponse(
			JSON.stringify({ message: 'Subscribed successfully.' }),
			{ status: 200 },
		)
	} catch (err) {
		console.error('Resend subscribe error:', err)
		return new NextResponse(
			JSON.stringify({ error: 'Internal server error' }),
			{
				status: 500,
			},
		)
	}
}
