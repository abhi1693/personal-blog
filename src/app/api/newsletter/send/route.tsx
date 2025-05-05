import { BASE_URL } from '@/lib/env'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Parser from 'rss-parser'

const resend = new Resend(process.env.RESEND_API_KEY_FULL)
const parser = new Parser()

export const runtime = 'nodejs'

export const POST = async (req: Request) => {
	try {
		if (
			process.env.NODE_ENV === 'production' &&
			req.headers.get('x-vercel-cron') !== 'true'
		) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		let feed
		try {
			feed = await parser.parseURL(`${BASE_URL}/posts/rss.xml`)
		} catch (rssErr) {
			console.error('❌ Failed to fetch RSS feed:', rssErr)
			return NextResponse.json(
				{ error: 'RSS feed fetch failed' },
				{ status: 500 },
			)
		}

		const now = new Date()
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

		const recentPosts = feed.items.filter((item) => {
			const pubDate = item.isoDate ? new Date(item.isoDate) : null
			return pubDate && pubDate > thirtyDaysAgo
		})

		if (recentPosts.length === 0) {
			return NextResponse.json({ message: 'No new posts in the last 30 days.' })
		}

		const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.6; color: #222; max-width: 640px; margin: auto; padding: 24px;">
    <header style="border-bottom: 1px solid #ccc; margin-bottom: 24px; padding-bottom: 16px;">
      <h1 style="font-size: 22px; margin: 0;">📰 Latest from Abhimanyu's Blog</h1>
      <p style="font-size: 14px; margin: 8px 0 0;">Scaling infrastructure, one cluster at a time</p>
    </header>

    <ul style="list-style-type: none; padding: 0; margin: 0 0 32px 0;">
      ${recentPosts
				.map((post) => {
					const date = new Date(post.isoDate || '').toLocaleDateString()
					const summary = post.summary?.replace(/<\/?[^>]+(>|$)/g, '') || '' // strip HTML
					return `
          <li style="margin-bottom: 24px;">
            <a href="${BASE_URL}${post.link}" target="_blank" style="font-weight: 600; font-size: 16px; color: #0b5fff; text-decoration: none;">${post.title}</a><br />
            <span style="font-size: 13px; color: #555;">${date}</span>
            <p style="margin-top: 8px; font-size: 14px; color: #333;">${summary}</p>
          </li>
        `
				})
				.join('')}
    </ul>

    <footer style="border-top: 1px solid #ccc; padding-top: 16px; font-size: 14px; color: #666;">
      — Abhimanyu<br />
      <a href="https://blog.abhimanyu-saharan.com" style="color: #0b5fff;">Visit the Blog</a> |
      <a href="https://www.youtube.com/@AbhimanyuSaharanOfficial" style="color: #0b5fff;">YouTube</a>
    </footer>
  </div>
`

		const response = await resend.contacts.list({
			audienceId: process.env.NEXT_RESEND_AUDIENCE_ID!,
		})

		const contacts = response?.data?.data || []
		let successCount = 0
		let skippedCount = 0

		for (const contact of contacts) {
			if (!contact.email) {
				skippedCount++
				continue
			}

			try {
				await resend.emails.send({
					from: 'Abhimanyu Saharan <noreply@abhimanyu-saharan.com>',
					to: contact.email,
					subject: '📬 New Blog Posts from Abhimanyu',
					html,
				})
				successCount++
			} catch (err) {
				console.error(`❌ Failed to send to ${contact.email}:`, err)
			}
		}

		return NextResponse.json({
			message: `✅ Sent newsletter to ${successCount} subscriber(s). Skipped ${skippedCount}. Included ${recentPosts.length} post(s).`,
		})
	} catch (err) {
		console.error('Newsletter send error:', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
