import '../tailwind.css'

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics
        beforeSend={(event: BeforeSendEvent) => {
          if (event.url.includes('/studio')) {
            return null
          }
          return event
        }}
      />
      <SpeedInsights
        beforeSend={(event) => {
          if (event.url.includes('/studio')) {
            return null
          }
          return event
        }}
      />
    </html>
  )
}
