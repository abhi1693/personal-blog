import { NextResponse } from 'next/server'
import { createClient } from 'redis'

let redis: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
	if (!redis) {
		redis = createClient({ url: process.env.REDIS_URL })
		redis.on('error', (err) => console.error('Redis Client Error', err))
		await redis.connect()
	}
	return redis
}

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
			{
				status: 400,
			},
		)
	}

	const { email, name } = body

	if (!email || typeof email !== 'string') {
		return new NextResponse(JSON.stringify({ error: 'Email is required.' }), {
			status: 400,
		})
	}

	const client = await getRedisClient()
	const key = `subscriber:${email.toLowerCase()}`
	const exists = await client.exists(key)

	if (exists) {
		return new NextResponse(
			JSON.stringify({ message: 'Already subscribed.' }),
			{
				status: 200,
			},
		)
	}

	await client.set(
		key,
		JSON.stringify({
			email: email.toLowerCase(),
			name: name || null,
			subscribedAt: new Date().toISOString(),
		}),
	)

	return new NextResponse(
		JSON.stringify({ message: 'Subscribed successfully.' }),
		{
			status: 200,
		},
	)
}
