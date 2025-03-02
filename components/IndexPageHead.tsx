import BlogMeta from 'components/BlogMeta'
import { Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { stegaClean, toPlainText } from 'next-sanity'

import { getProdUrl } from './utils/getProdUrl'

export interface IndexPageHeadProps {
  settings: Settings
}

export default function IndexPageHead({ settings }: IndexPageHeadProps) {
  const { title, description, ogImage = {} } = settings
  const ogImageTitle = ogImage?.title

  return (
    <Head>
      <title>{stegaClean(title)}</title>
      <BlogMeta />
      <meta
        key="description"
        name="description"
        content={toPlainText(description)}
      />
      <meta
        property="og:image"
        content={`${getProdUrl()}/api/og?${new URLSearchParams({ title: ogImageTitle })}`}
      />
      <meta property="og:site_name" content={stegaClean(title)} />
      <meta property="og:title" content={stegaClean(title)} />
      <meta property="og:description" content={toPlainText(description)} />
      <meta property="og:url" content={getProdUrl()} />
    </Head>
  )
}
