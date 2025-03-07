import Head from 'next/head'
import { ReactNode } from 'react'

import { getBaseUrl } from './utils/getBaseUrl'

interface MetaHeadProps {
  title: string
  site_name: string
  description: string
  imageUrl?: string
  url?: string
  keywords?: string[]
  children?: ReactNode
}

export default function MetaHead({
  title,
  site_name,
  description,
  imageUrl,
  url = getBaseUrl(),
  keywords = [],
  children,
}: MetaHeadProps) {
  if (!imageUrl) {
    imageUrl = `${getBaseUrl()}/api/og?${new URLSearchParams({ title: title })}`
  }

  return (
    <Head>
      <title>{title}</title>

      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />

      {/* Meta Description & Keywords */}
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content={site_name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:logo" content="/favicon/favicon.ico" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Allow passing additional meta tags or elements */}
      {children}
    </Head>
  )
}
