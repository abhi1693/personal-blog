import Avatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import YouTubeEmbed from 'components/YouTubeEmbed'
import type { Post } from 'lib/sanity.queries'
import { useEffect, useState, useMemo } from 'react'
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa'

function ShareOptions({
  shareUrls,
}: {
  shareUrls: { x: string; facebook: string; linkedin: string }
}) {

  return (
    <div className="relative flex items-center">
      <div className="flex space-x-4 items-center">
        <a
          href={shareUrls.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="text-blue-500 hover:text-blue-600"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="text-blue-700 hover:text-blue-800"
        >
          <FaFacebookF size={24} />
        </a>
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="text-blue-600 hover:text-blue-700"
        >
          <FaLinkedinIn size={24} />
        </a>
      </div>
    </div>
  )
}

export default function PostHeader(
  props: Pick<Post, 'title' | 'date' | 'author' | 'youtubeEmbed'>,
) {
  const { title, date, author, youtubeEmbed } = props

  // Use state to hold the current URL (set on the client)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Build a consistent URL using origin and pathname.
      const url = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}${window.location.pathname}`
        : window.location.href
      setCurrentUrl(url)
    }
  }, [])

  // Memoize share URLs so they only update when currentUrl or title changes.
  const shareUrls = useMemo(() => {
    return {
      // "X" is rebranding for Twitter.
      x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl,
      )}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl,
      )}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        currentUrl,
      )}&title=${encodeURIComponent(title)}`,
    }
  }, [currentUrl, title])

  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="mb-8 sm:mx-0 md:mb-16">
        <YouTubeEmbed url={youtubeEmbed.url} />
      </div>
      <div className="mx-auto max-w-2xl">
        {/* Desktop view: author avatar and share options side by side */}
        <div className="mb-6 hidden md:flex items-center justify-between">
          {author && <Avatar name={author.name} picture={author.picture} />}
          <ShareOptions shareUrls={shareUrls} />
        </div>
        {/* Mobile view: avatar above and share options centered below */}
        <div className="mb-6 block md:hidden">
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
        <div className="mb-6 block md:hidden">
          <div className="flex justify-center">
            <ShareOptions shareUrls={shareUrls} />
          </div>
        </div>
        <div className="mb-6 text-lg">
          <Date dateString={date} />
        </div>
      </div>
    </>
  )
}
