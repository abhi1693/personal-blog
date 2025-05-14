import '@/styles/app.css'
import Announcement from '@/ui/Announcement'
import Root from '@/ui/Root'
import SkipToContent from '@/ui/SkipToContent'
import VisualEditingControls from '@/ui/VisualEditingControls'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import _ from 'next/dynamic'
import Script from 'next/script'
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
			<GoogleTagManager gtmId={process.env.NEXT_GOOGLE_TAG_MANAGER_ID || ''} />
			{process.env.NODE_ENV === 'production' && (
				<>
					<Script
						src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
						strategy="afterInteractive"
					/>

					<Script id="onesignal-init" strategy="afterInteractive">
						{`
						window.OneSignalDeferred = window.OneSignalDeferred || [];
						OneSignalDeferred.push(async function(OneSignal) {
							await OneSignal.init({
								appId: "${process.env.NEXT_ONESIGNAL_APP_ID}",
							});
						});
					`}
					</Script>
				</>
			)}
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
			</body>
		</Root>
	)
}
