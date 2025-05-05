import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY_FULL)

export const POST = async (req: Request) => {
	if (req.method !== 'POST') {
		return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
		})
	}

	const contentType = req.headers.get('content-type')
	if (!contentType?.includes('application/json')) {
		return new NextResponse(JSON.stringify({ error: 'Invalid content-type' }), {
			status: 400,
		})
	}

	let body: any
	try {
		body = await req.json()
	} catch {
		return new NextResponse(
			JSON.stringify({ error: 'Request body must be valid JSON' }),
			{ status: 400 },
		)
	}

	const { email, firstName, lastName } = body

	if (!email || typeof email !== 'string') {
		return new NextResponse(JSON.stringify({ error: 'Email is required.' }), {
			status: 400,
		})
	}

	try {
		const { error } = await resend.contacts.create({
			email: email.toLowerCase(),
			audienceId: process.env.NEXT_RESEND_AUDIENCE_ID!,
			firstName: firstName || undefined,
			lastName: lastName || undefined,
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
