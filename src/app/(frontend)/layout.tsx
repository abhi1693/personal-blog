import { BASE_URL } from '@/lib/env'
import '@/styles/app.css'
import Announcement from '@/ui/Announcement'
import Root from '@/ui/Root'
import SkipToContent from '@/ui/SkipToContent'
import VisualEditingControls from '@/ui/VisualEditingControls'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import _ from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const dynamic = 'force-dynamic'
const Subscriber = _(() => import('@/ui/Subscriber'), { ssr: true })

const BASE_DESCRIPTION =
	'A technical blog by Abhimanyu Saharan, focused on DevOps, automation, Kubernetes, infrastructure, and real-world software engineering insights.'
const BASE_IMAGE = `/api/og?title=${encodeURIComponent(BASE_DESCRIPTION)}`
const BASE_URL_OBJECT = new URL(BASE_URL)

export const metadata: Metadata = {
	title: {
		template: '%s | Abhimanyu Saharan',
		default: 'Blog',
	},
	description: 'A technical blog by Abhimanyu Saharan, focused on DevOps, automation, Kubernetes, infrastructure, and real-world software engineering insights.',
	metadataBase: BASE_URL_OBJECT,
	category: 'technology',
	openGraph: {
		type: 'website',
		url: BASE_URL_OBJECT.toString(),
		title: 'Blog by Abhimanyu Saharan',
		description: 'A technical blog by Abhimanyu Saharan, focused on DevOps, automation, Kubernetes, infrastructure, and real-world software engineering insights.',
		images: [BASE_IMAGE],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Blog by Abhimanyu Saharan',
		description: 'A technical blog by Abhimanyu Saharan, focused on DevOps, automation, Kubernetes, infrastructure, and real-world software engineering insights.',
		images: [BASE_IMAGE],
	},
	verification: {
		other: {
			'google-adsense-account': process.env.NEXT_GOOGLE_ADSENSE_ID ?? '',
		},
	},
}

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

				<Analytics />
				<SpeedInsights />
			</body>
		</Root>
	)
}
