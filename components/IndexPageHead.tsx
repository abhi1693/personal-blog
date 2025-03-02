import BlogMeta from 'components/BlogMeta'
import { Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { stegaClean, toPlainText } from 'next-sanity'

import { getProdUrl } from './utils/getProdUrl'

export interface IndexPageHeadProps {
  settings: Settings
}

export default function IndexPageHead({ settings }: IndexPageHeadProps) {
  const { title, description, ogImage } = settings
  const ogImageTitle = ogImage.title
  const imageUrl = `${getProdUrl()}/api/og?${new URLSearchParams({ title: ogImageTitle })}`

  return (
    <Head>
      <title>{stegaClean(title)}</title>
      <BlogMeta />

      {/* Meta Description */}
      <meta
        key="description"
        name="description"
        content={toPlainText(description)}
      />

      {/* Open Graph Metadata */}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={stegaClean(title)} />
      <meta property="og:title" content={stegaClean(title)} />
      <meta property="og:description" content={toPlainText(description)} />
      <meta property="og:url" content={getProdUrl()} />

      {/* Twitter Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={stegaClean(title)} />
      <meta name="twitter:description" content={toPlainText(description)} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  )
}
