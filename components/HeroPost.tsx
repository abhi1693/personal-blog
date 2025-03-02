import AuthorAvatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

export default function HeroPost(
  props: Pick<
    Post,
    'title' | 'coverImage' | 'date' | 'excerpt' | 'author' | 'slug'
  >,
) {
  const { title, coverImage, date, excerpt, author, slug } = props

  return (
    <section className="relative rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      <CoverImage slug={slug} title={title} image={coverImage} priority />

      {/* Content Section */}
      <div className="bg-white p-6 md:p-8 lg:p-10 border-t">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          <Link href={`/posts/${slug}`} className="hover:underline">
            {title || 'Untitled'}
          </Link>
        </h3>

        <div className="flex items-center justify-between text-sm md:text-base text-gray-500 mt-2">
          <Date dateString={date} />
        </div>

        {excerpt && (
          <p className="text-sm md:text-lg mt-4 text-gray-700">{excerpt}</p>
        )}

        {/* Author Section with Better Spacing */}
        {author && (
          <div className="flex items-center gap-4 mt-6 border-t pt-4">
            <AuthorAvatar name={author.name} picture={author.picture} />
            <div className="text-sm md:text-base font-medium text-gray-800">
              {author.name}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
