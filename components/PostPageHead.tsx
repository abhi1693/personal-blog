import BlogMeta from 'components/BlogMeta'
import { urlForImage } from 'lib/sanity.image'
import { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { stegaClean } from 'next-sanity'

import PostSchemaMarkup from './PostSchemaMarkup'
import { getProdUrl } from './utils/getProdUrl'

export interface PostPageHeadProps {
  settings: Settings
  post: Post
}

export default function PostPageHead({ settings, post }: PostPageHeadProps) {
  const title = stegaClean(
    post.title ? `${post.title} | ${settings.title}` : settings.title,
  )
  const description = post.excerpt || 'Read the latest blog post.'
  const imageUrl = post.coverImage?.asset?._ref
    ? urlForImage(post.coverImage).width(1200).height(627).fit('fill').url()
    : `${getProdUrl()}/api/og?${new URLSearchParams({ title: settings.ogImage.title })}`
  const postUrl = `${getProdUrl()}/posts/${post.slug}`

  return (
    <Head>
      <title>{title}</title>
      <BlogMeta />
      <PostSchemaMarkup post={post} />

      <meta property="description" content={description} />

      {/* Open Graph Metadata */}
      <meta property="og:site_name" content={settings.title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={postUrl} />
      <meta property="og:type" content="article" />

      {/* Twitter Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  )
}
