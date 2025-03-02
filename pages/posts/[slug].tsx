import PostPage from 'components/PostPage'
import PreviewPostPage from 'components/PreviewPostPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllPostsSlugs,
  getClient,
  getPostAndMorePosts,
  getSettings,
} from 'lib/sanity.client'
import { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

import { getBaseUrl } from '../../components/utils/getBaseUrl'

interface PageProps extends SharedPageProps {
  post: Post
  morePosts: Post[]
  settings?: Settings
  postUrl: string
}

interface Query {
  [key: string]: string
}

export default function ProjectSlugRoute(props: PageProps) {
  const { settings, post, morePosts, draftMode, postUrl } = props

  if (draftMode) {
    return (
      <PreviewPostPage
        post={post}
        morePosts={morePosts}
        settings={settings}
        postUrl={postUrl}
      />
    )
  }

  return (
    <PostPage
      post={post}
      morePosts={morePosts}
      settings={settings}
      postUrl={postUrl}
    />
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, { post, morePosts }] = await Promise.all([
    getSettings(client),
    getPostAndMorePosts(client, params.slug),
  ])

  if (!post) {
    return {
      notFound: true,
    }
  }

  const baseUrl = getBaseUrl()
  const postUrl = `${baseUrl}/posts/${post.slug}`

  return {
    props: {
      post,
      morePosts,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
      postUrl,
    },
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllPostsSlugs()

  return {
    paths: slugs?.map(({ slug }) => `/posts/${slug}`) || [],
    fallback: 'blocking',
  }
}
