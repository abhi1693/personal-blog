import '@/styles/app.css'
import Announcement from '@/ui/Announcement'
import Root from '@/ui/Root'
import SkipToContent from '@/ui/SkipToContent'
import VisualEditingControls from '@/ui/VisualEditingControls'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import _ from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const dynamic = 'force-dynamic'
const Subscriber = _(() => import('@/ui/Subscriber'), { ssr: true })

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Root>
			<body className="bg-canvas text-ink antialiased">
				<NuqsAdapter>
					<SkipToContent />
					<Announcement />
					<Header />
					<main id="main-content" role="main" tabIndex={-1}>
						{children}
					</main>
					<Footer />
					<Subscriber />

					<VisualEditingControls />
				</NuqsAdapter>
				<GoogleAnalytics gaId={process.env.NEXT_GOOGLE_ANALYTICS_ID || ''} />
				<SpeedInsights />
			</body>
		</Root>
	)
}
