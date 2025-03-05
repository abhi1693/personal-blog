import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import MorePosts from 'components/MorePosts'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import type { Post, Settings } from 'lib/sanity.queries'
import dynamic from 'next/dynamic'
import Error from 'next/error'

const PostHeader = dynamic(() => import('components/PostHeader'), {
  ssr: false,
})
const PostBody = dynamic(() => import('components/PostBody'), { ssr: false })

export interface PostPageProps {
  preview?: boolean
  loading?: boolean
  post: Post
  morePosts: Post[]
  settings: Settings
  postUrl: string
}

const NO_POSTS: Post[] = []

export default function PostPage(props: PostPageProps) {
  const {
    preview,
    loading,
    morePosts = NO_POSTS,
    post,
    settings,
    postUrl,
  } = props

  const slug = post?.slug

  if (!slug && !preview) {
    return <Error statusCode={404} />
  }

  return (
    <>
      <PostPageHead settings={settings} post={post} />

      <Layout preview={preview} loading={loading}>
        <Container>
          {preview && !post ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <article>
                <PostHeader
                  title={post.title}
                  date={post.date}
                  author={post.author}
                  youtubeEmbed={post.youtubeEmbed}
                  postUrl={postUrl}
                />
                <PostBody content={post.content} />
              </article>
              <SectionSeparator />
              {morePosts?.length > 0 && <MorePosts posts={morePosts} />}
            </>
          )}
        </Container>
      </Layout>
    </>
  )
}
