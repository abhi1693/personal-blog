import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import type { Post, Settings } from 'lib/sanity.queries'
import dynamic from 'next/dynamic'

const MorePosts = dynamic(() => import('components/MorePosts'), { ssr: false })

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  settings: Settings
}

export default function IndexPage({
  preview,
  loading,
  posts,
  settings,
}: IndexPageProps) {
  const [heroPost, ...morePosts] = posts || []

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          {/* Hero Post at the top */}
          {heroPost && <HeroPost {...heroPost} />}

          {/* More Posts in a Grid */}
          {morePosts.length > 0 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <MorePosts posts={morePosts} />
            </div>
          )}
        </Container>
      </Layout>
    </>
  )
}
