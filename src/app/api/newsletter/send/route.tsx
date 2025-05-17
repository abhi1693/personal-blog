import { BASE_URL } from '@/lib/env'
import type { NextRequest } from 'next/server'
import { Resend } from 'resend'
import Parser from 'rss-parser'

const resend = new Resend(process.env.RESEND_API_KEY_FULL)
const parser = new Parser()

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get('authorization')
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const feed = await parser.parseURL(`${BASE_URL}/posts/rss.xml`)

		const now = new Date()
		const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

		const recentPosts = feed.items.filter((item) => {
			const pubDate = item.isoDate ? new Date(item.isoDate) : null
			return pubDate && pubDate > oneWeekAgo
		})

		if (recentPosts.length === 0) {
			return new Response('No new posts in the last 7 days.', { status: 404 })
		}

		const { data: contactData } = await resend.contacts.list({
			audienceId: process.env.NEXT_RESEND_AUDIENCE_ID!,
		})

		const contacts = contactData?.data || []

		const sendResults = await Promise.allSettled(
			contacts
				.filter((c) => c.email)
				.map((c) => {
					const encodedEmail = encodeURIComponent(c.email!)
					const unsubscribeUrl = `${BASE_URL}/api/newsletter/unsubscribe?email=${encodedEmail}`

					const html = `
<div style="font-family: system-ui, sans-serif; font-size: 16px; color: #222; max-width: 640px; margin: auto; padding: 24px;">
  <header style="border-bottom: 1px solid #ccc; margin-bottom: 24px;">
    <h1 style="margin: 0;">📰 Latest from Abhimanyu's Blog</h1>
    <p style="font-size: 14px; margin-top: 8px;">Scaling infrastructure, one cluster at a time</p>
  </header>
  <ul style="padding: 0; list-style: none; margin: 0 0 32px;">
    ${recentPosts
			.map((post) => {
				const date = new Date(post.isoDate || '').toLocaleDateString()
				const summary = post.summary?.replace(/<\/?[^>]+(>|$)/g, '') || ''
				return `
      <li style="margin-bottom: 24px;">
        <a href="${post.link}" target="_blank" style="font-weight: bold; font-size: 16px; color: #0b5fff; text-decoration: none;">${post.title}</a><br />
        <span style="font-size: 13px; color: #555;">${date}</span>
        <p style="font-size: 14px; color: #333;">${summary}</p>
      </li>`
			})
			.join('')}
  </ul>
  <footer style="border-top: 1px solid #ccc; padding-top: 16px; font-size: 14px; color: #666;">
    — Abhimanyu<br />
    <a href="${BASE_URL}" style="color: #0b5fff;">Visit the Blog</a> |
    <a href="https://www.youtube.com/@AbhimanyuSaharanOfficial" style="color: #0b5fff;">YouTube</a> |
    <a href="https://patreon.com/asaharan" style="color: #0b5fff;">Patreon</a> |
    <a href="${unsubscribeUrl}" style="color: #0b5fff;">Unsubscribe</a>
  </footer>
</div>
`

					return resend.emails.send({
						from: 'Abhimanyu Saharan <noreply@abhimanyu-saharan.com>',
						to: c.email!,
						subject: '📬 New Blog Posts from Abhimanyu',
						headers: {
							'List-Unsubscribe': `<${unsubscribeUrl}>`,
						},
						html,
					})
				}),
		)

		const successCount = sendResults.filter(
			(r) => r.status === 'fulfilled',
		).length
		const failedCount = sendResults.filter(
			(r) => r.status === 'rejected',
		).length
		const skippedCount = contacts.length - sendResults.length

		return Response.json({
			message: `✅ Sent to ${successCount} subscriber(s). Failed: ${failedCount}. Skipped: ${skippedCount}. Posts included: ${recentPosts.length}`,
		})
	} catch (err) {
		console.error('❌ Newsletter job failed:', err)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
