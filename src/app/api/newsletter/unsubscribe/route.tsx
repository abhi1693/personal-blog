import { BASE_URL } from '@/lib/env'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY_FULL)

export const GET = async (req: Request) => {
	const url = new URL(req.url)
	const email = url.searchParams.get('email')

	if (!email || typeof email !== 'string') {
		return NextResponse.json(
			{ error: 'Valid email is required' },
			{ status: 400 },
		)
	}

	try {
		await resend.contacts.remove({
			email: email.toLowerCase(),
			audienceId: process.env.NEXT_RESEND_AUDIENCE_ID!,
		})

		return new Response(
			`<html lang="en"><body style="font-family: system-ui; text-align: center; padding: 3rem;">
				<h2>You've been unsubscribed.</h2>
				<p style="color: #666;">${email} has been removed from our mailing list.</p>
				<a href="${BASE_URL}" style="color: #0b5fff;">Return to site</a>
			</body></html>`,
			{ status: 200, headers: { 'Content-Type': 'text/html' } },
		)
	} catch (err) {
		console.error('❌ Failed to unsubscribe:', err)
		return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 500 })
	}
}
