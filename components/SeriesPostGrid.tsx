import Image from 'next/image'
import Link from 'next/link'

import { urlForImage } from '../lib/sanity.image'

interface SeriesPostGridProps {
  posts: {
    _id: string
    title: string
    slug: string
    excerpt?: string
    date?: string
    coverImage?: { asset: { _ref: string } }
  }[]
}

export default function SeriesPostGrid({ posts }: SeriesPostGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
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
                priority={true}
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
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
