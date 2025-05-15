import { dev } from '@/lib/env'
import '@/styles/app.css'
import Announcement from '@/ui/Announcement'
import Root from '@/ui/Root'
import SkipToContent from '@/ui/SkipToContent'
import VisualEditingControls from '@/ui/VisualEditingControls'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const Subscriber = dynamic(() => import('@/ui/Subscriber'), { ssr: true })

const gtmId = process.env.NEXT_GOOGLE_TAG_MANAGER_ID || ''
const gaId = process.env.NEXT_GOOGLE_ANALYTICS_ID || ''
const oneSignalAppId = process.env.NEXT_ONESIGNAL_APP_ID || ''

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Root>
			{!dev && gtmId && <GoogleTagManager gtmId={gtmId} />}
			{!dev && oneSignalAppId && (
				<>
					<Script
						src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
						strategy="afterInteractive"
					/>
					<Script id="onesignal-init" strategy="afterInteractive">
						{`
					window.OneSignalDeferred = window.OneSignalDeferred || [];
					OneSignalDeferred.push(async function(OneSignal) {
						await OneSignal.init({ appId: "${oneSignalAppId}" });
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
				{!dev && gaId && <GoogleAnalytics gaId={gaId} />}
			</body>
		</Root>
	)
}
