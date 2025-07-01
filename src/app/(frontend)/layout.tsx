import { dev } from '@/lib/env'
import '@/styles/app.css'
import Announcement from '@/ui/Announcement'
import NewsletterModalClient from '@/ui/NewsletterModalClient'
import Root from '@/ui/Root'
import SkipToContent from '@/ui/SkipToContent'
import VisualEditingControls from '@/ui/VisualEditingControls'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const gtmId = process.env.NEXT_GOOGLE_TAG_MANAGER_ID || ''
const gaId = process.env.NEXT_GOOGLE_ANALYTICS_ID || ''

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Root>
			<head>
				<link rel="preconnect" href="https://k.clarity.ms" />
				<link rel="preconnect" href="https://c.clarity.ms" />
				<link rel="preconnect" href="https://imgsct.cookiebot.com" />
				<link rel="preconnect" href="https://c.bing.com" />
				<link rel="preconnect" href="https://pagead2.googlesyndication.com" />
			</head>
			{!dev && gtmId && <GoogleTagManager gtmId={gtmId} />}
			<body className="bg-canvas text-ink antialiased">
				<NuqsAdapter>
					<SkipToContent />
					<Announcement />
					<Header />
					<main id="main-content" role="main" tabIndex={-1}>
						{children}
						{/*<NewsletterModalClient />*/}
					</main>
					<Footer />

					<VisualEditingControls />
				</NuqsAdapter>
				{!dev && gaId && <GoogleAnalytics gaId={gaId} />}
			</body>
		</Root>
	)
}
