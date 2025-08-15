import TableOfContents from '@/ui/modules/RichtextModule/TableOfContents'
import ShareButtons from '@/ui/ShareButtons'
import SubscriberForm from '@/ui/SubscriberForm'
import BookPromo from '@/ui/modules/blog/BookPromo'
import { BASE_URL } from '@/lib/env'

export default function PostSidebar({ post }: { post: Sanity.BlogPost }) {
  const showTOC = !post.hideTableOfContents && !!post.headings?.length

  return (
    <aside className="lg:sticky-below-header mx-auto w-full max-w-lg self-start [--offset:1rem] lg:order-1 lg:w-3xs">
      {showTOC && <TableOfContents headings={post.headings} />}

      <>
        <ShareButtons
          url={`${BASE_URL}/posts/${post.metadata.slug.current}`}
          title={post.metadata.title}
        />

        <div className="my-6 border-t border-gray-200" />

        <BookPromo authors={post.authors} />

        <div className="my-6 border-t border-gray-200" />

        {/* Patreon CTA */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            Enjoying the content? Become a patron to support the work.
          </p>
          <a
            href="https://www.patreon.com/asaharan?utm_source=blog&utm_medium=sidebar&utm_campaign=patreon_cta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Support on Patreon
          </a>
        </div>

        <div className="my-6 border-t border-gray-200" />

        <SubscriberForm />

        <div className="my-6 border-t border-gray-200" />
      </>
    </aside>
  )
}

