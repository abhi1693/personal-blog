import BlogMeta from 'components/BlogMeta'
import { Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { stegaClean, toPlainText } from 'next-sanity'

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
        // Because OG images must have a absolute URL, we use the
        // `VERCEL_PROJECT_PRODUCTION_URL` environment variable to get the deployment’s URL.
        // More info:
        // https://vercel.com/docs/concepts/projects/environment-variables
        content={`${
          process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : ''
        }/api/og?${new URLSearchParams({ title: ogImageTitle })}`}
      />
    </Head>
  )
}
