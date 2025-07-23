import { BASE_URL } from '@/lib/env'
import type { NextRequest } from 'next/server'
import { Resend } from 'resend'
import Parser from 'rss-parser'

const resend = new Resend(process.env.RESEND_API_KEY_FULL)
const parser = new Parser()

export const runtime = 'nodejs'

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

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
		const sendResults: PromiseSettledResult<any>[] = []

		for (const c of contacts) {
			if (!c.email) continue

			const encodedEmail = encodeURIComponent(c.email)
			const unsubscribeUrl = `${BASE_URL}/api/newsletter/unsubscribe?email=${encodedEmail}`

			const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 16px; color: #222; max-width: 640px; margin: auto; padding: 24px; line-height: 1.6;">
  <header style="border-bottom: 2px solid #eee; margin-bottom: 24px; padding-bottom: 8px;">
    <h1 style="margin: 0; font-size: 24px;">📰 Abhimanyu's Blog Digest</h1>
    <p style="font-size: 14px; color: #666; margin-top: 4px;">Scaling infrastructure, one cluster at a time</p>
  </header>
  <ul style="padding: 0; list-style: none; margin: 0 0 32px;">
    ${recentPosts
			.map((post) => {
				const date = new Date(post.isoDate || '1970-01-01').toLocaleDateString(
					'en-US',
					{ month: 'short', day: 'numeric', year: 'numeric' },
				)
				const summary =
					post.contentSnippet?.slice(0, 200).replace(/<\/?[^>]+(>|$)/g, '') ||
					''

				return `
      <li style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #eee;">
        <a href="${post.link}" target="_blank" style="font-weight: 600; font-size: 18px; color: #0b5fff; text-decoration: none; display: block; margin-bottom: 4px;">${post.title}</a>
        <div style="font-size: 13px; color: #999; margin-bottom: 8px;">${date}</div>
        <p style="font-size: 14px; color: #333; margin: 0;">${summary}...</p>
      </li>`
			})
			.join('')}
  </ul>

  <section style="border-top: 2px solid #eee; padding-top: 24px; margin-top: 32px;">
    <p style="font-size: 15px; font-weight: 500; margin-bottom: 8px;">Books by Abhimanyu Saharan</p>
    <div style="margin-bottom: 16px;">
      <a href="https://www.amazon.com/dp/B0FH7LM19W" target="_blank" style="text-decoration: none; color: #0b5fff; font-weight: 600; font-size: 15px;">📘 Kubernetes Production Readiness - Series</a>
      <p style="margin: 4px 0 16px 0; font-size: 14px; color: #555;">Available in Kindle and Paperback. Everything you need to know before deploying Kubernetes to production.</p>

      <a href="https://www.amazon.com/dp/B0FHXX9R5X" target="_blank" style="text-decoration: none; color: #0b5fff; font-weight: 600; font-size: 15px;">🧠 Thinking Like A Developer: In the Age of AI</a>
      <p style="margin: 4px 0 0 0; font-size: 14px; color: #555;">Sharpen your thinking, not just your syntax. A guide to structured problem-solving and using AI effectively.</p>
    </div>
    <p style="font-size: 13px; color: #999;">See all books on <a href="https://www.amazon.com/stores/Abhimanyu-Saharan/author/B0FHX5NFNY" target="_blank" style="color: #0b5fff;">Amazon Author Page</a>.</p>
  </section>

  <section style="border-top: 2px solid #eee; padding-top: 24px; margin-top: 32px;">
    <p style="font-size: 15px; font-weight: 500; margin-bottom: 8px;">Support my work and get more in-depth content:</p>
    <a href="https://patreon.com/asaharan" style="display: inline-block; background-color: #ff424d; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px; margin-bottom: 12px;">Join on Patreon</a>
    <div style="margin-top: 16px;">
      <a href="https://www.digitalocean.com/?refcode=e3b7cf0861b0&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge" target="_blank">
        <img src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%202.svg" alt="DigitalOcean Referral Badge" style="max-width: 160px;" />
      </a>
    </div>
  </section>

  <footer style="border-top: 1px solid #ccc; padding-top: 16px; font-size: 14px; color: #666; text-align: center; margin-top: 32px;">
    — Abhimanyu<br />
    <a href="${BASE_URL}" style="color: #0b5fff; text-decoration: none;">Visit the Blog</a> |
    <a href="https://www.youtube.com/@AbhimanyuSaharanOfficial" style="color: #0b5fff; text-decoration: none;">YouTube</a> |
    <a href="https://patreon.com/asaharan" style="color: #0b5fff; text-decoration: none;">Patreon</a> |
    <a href="https://www.amazon.com/stores/Abhimanyu-Saharan/author/B0FHX5NFNY" style="color: #0b5fff; text-decoration: none;">Books</a> |
    <a href="${unsubscribeUrl}" style="color: #0b5fff; text-decoration: none;">Unsubscribe</a>
  </footer>
</div>
`

			try {
				const res = await resend.emails.send({
					from: 'Abhimanyu Saharan <noreply@abhimanyu-saharan.com>',
					to: c.email,
					subject: '📬 New Blog Posts from Abhimanyu',
					headers: {
						'List-Unsubscribe': `<${unsubscribeUrl}>`,
					},
					html,
				})
				sendResults.push({ status: 'fulfilled', value: res })
			} catch (err) {
				sendResults.push({ status: 'rejected', reason: err })
			}

			await sleep(5000) // wait 5 seconds between each email
		}

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
