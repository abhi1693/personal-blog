import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

export default function MorePosts({ posts }: { posts: Post[] }) {
  return (
    <>
      {posts.map((post) => (
        <div
          key={post.slug}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <Link href={`/posts/${post.slug}`} className="block">
            {/* Cover Image */}
            <CoverImage
              slug={post.slug}
              title={post.title}
              image={post.coverImage}
              alt={post.title}
            />

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold leading-tight">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500">
                <Date dateString={post.date} />
              </p>
              <p className="mt-2 text-gray-700 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        </div>
      ))}
    </>
  )
}
