import '../tailwind.css'

import AnalyticsClient from 'components/AnalyticsClient'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <AnalyticsClient />
    </html>
  )
}
