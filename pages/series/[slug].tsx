import { GetStaticPaths,GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import ShareOptions from '../../components/ShareOptions'
import { getAllSeries,getSeriesBySlug } from '../../lib/sanity.client'
import { urlForImage } from '../../lib/sanity.image'

interface SeriesPageProps {
  series: {
    title: string
    posts: {
      _id: string
      title: string
      slug: string
      excerpt?: string
      date?: string
      coverImage?: { asset: { _ref: string } }
    }[]
  }
}

export default function SeriesPage({ series }: SeriesPageProps) {
  const seriesUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="text-sm text-gray-500 mb-2">
        <Link href="/series" className="hover:underline">
          Series
        </Link>
        <span> / {series.title}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {series.title} ({series.posts.length}{' '}
          {series.posts.length === 1 ? 'Post' : 'Posts'})
        </h1>
        <ShareOptions url={seriesUrl} title={series.title} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.posts.map((post) => (
          <Link
            key={post._id}
            href={`/posts/${post.slug}`}
            className="block group"
          >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition transform hover:scale-105 hover:shadow-xl">
              {post.coverImage?.asset?._ref && (
                <Image
                  src={urlForImage(post.coverImage.asset._ref).url()}
                  alt={post.title}
                  width={500}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-500 transition">
                  {post.title}
                </h2>

                {post.date && (
                  <p className="text-gray-500 text-xs mt-1">
                    Published on{' '}
                    {new Date(post.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}

                {post.excerpt && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-3 text-right">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const series = await getAllSeries()
  return {
    paths: series.map((s) => ({ params: { slug: s.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const series = await getSeriesBySlug(params?.slug as string)
  return { props: { series }, revalidate: 10 }
}
