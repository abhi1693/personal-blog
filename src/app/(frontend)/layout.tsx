import '@/styles/app.css'
import Announcement from '@/ui/Announcement'
import Root from '@/ui/Root'
import SkipToContent from '@/ui/SkipToContent'
import VisualEditingControls from '@/ui/VisualEditingControls'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const dynamic = 'force-dynamic'

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

					<VisualEditingControls />
				</NuqsAdapter>

				<Analytics />
				<SpeedInsights />
			</body>
		</Root>
	)
}
