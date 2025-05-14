import { BASE_URL } from '@/lib/env'
import { dataset, projectId } from '@/sanity/lib/env'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// Build image URL from Sanity asset reference
function getSanityImageUrl(
	ref: string,
	projectId: string,
	dataset: string,
): string | null {
	if (!ref?.startsWith('image-')) return null

	const parts = ref.split('-')
	if (parts.length !== 4) return null

	const [, assetId, dimensions, ext] = parts
	return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${ext}`
}

export async function POST(req: NextRequest) {
	const secret = process.env.SANITY_WEBHOOK_SECRET || ''
	const signatureHeader = req.headers.get('sanity-webhook-signature')

	if (!signatureHeader?.includes('t=') || !signatureHeader.includes('v1=')) {
		return NextResponse.json(
			{ error: 'Malformed or missing signature' },
			{ status: 401 },
		)
	}

	const [tPart, v1Part] = signatureHeader
		.split(',')
		.map((part) => part.split('=')[1])
	if (!tPart || !v1Part) {
		return NextResponse.json(
			{ error: 'Invalid signature format' },
			{ status: 401 },
		)
	}

	const rawBody = Buffer.from(await req.arrayBuffer())
	const payloadToSign = `${tPart}.${rawBody}`

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(payloadToSign)
		.digest('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '') // base64url encoding

	const expectedBuf = Buffer.from(expectedSignature)
	const actualBuf = Buffer.from(v1Part)

	if (expectedBuf.length !== actualBuf.length) {
		return NextResponse.json(
			{ error: 'Signature length mismatch' },
			{ status: 401 },
		)
	}

	const isValid = crypto.timingSafeEqual(expectedBuf, actualBuf)
	if (!isValid) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	let body: any
	try {
		body = JSON.parse(rawBody.toString('utf8'))
	} catch (err) {
		return NextResponse.json(
			{ error: `Invalid JSON body: ${err}` },
			{ status: 400 },
		)
	}

	const { metadata } = body
	const title = metadata?.title
	const description = metadata?.description
	const slug = metadata?.slug?.current
	const imageRef = metadata?.image?.asset?._ref

	if (!title || !description || !slug) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 },
		)
	}

	const postUrl = `${BASE_URL}/posts/${slug}`
	const imageUrl = getSanityImageUrl(imageRef, projectId, dataset)

	const onesignalPayload = {
		app_id: process.env.NEXT_ONESIGNAL_APP_ID,
		included_segments: ['Total Subscriptions'],
		headings: { en: title },
		contents: { en: description },
		url: postUrl,
		...(imageUrl && {
			chrome_web_image: imageUrl,
			chrome_web_icon: imageUrl,
		}),
	}

	try {
		const resp = await fetch('https://onesignal.com/api/v1/notifications', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Key ${process.env.ONESIGNAL_API_KEY}`,
			},
			body: JSON.stringify(onesignalPayload),
		})

		if (!resp.ok) {
			const errorText = await resp.text()
			console.error('❌ OneSignal response error:', errorText)
			return NextResponse.json(
				{ error: 'Failed to send notification', detail: errorText },
				{ status: 500 },
			)
		}

		console.log(
			`✅ Notification sent successfully to OneSignal for post: ${title}`,
		)
		return NextResponse.json({ success: true })
	} catch (err: any) {
		console.error('❌ Unexpected fetch error:', err)
		return NextResponse.json(
			{ error: 'Unexpected error', detail: err.message },
			{ status: 500 },
		)
	}
}
