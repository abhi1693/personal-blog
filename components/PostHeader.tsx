import Avatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import YouTubeEmbed from 'components/YouTubeEmbed'
import type { Post } from 'lib/sanity.queries'
import { useEffect, useMemo,useState } from 'react'
import { FaFacebookF, FaLinkedinIn,FaTwitter } from 'react-icons/fa'

function ShareOptions({
  shareUrls,
}: {
  shareUrls: { x: string; facebook: string; linkedin: string }
}) {
  const platforms = [
    {
      name: 'X',
      url: shareUrls.x,
      icon: <FaTwitter size={24} />,
      className: 'text-blue-500 hover:text-blue-600',
      title: 'Share on X',
    },
    {
      name: 'Facebook',
      url: shareUrls.facebook,
      icon: <FaFacebookF size={24} />,
      className: 'text-blue-700 hover:text-blue-800',
      title: 'Share on Facebook',
    },
    {
      name: 'LinkedIn',
      url: shareUrls.linkedin,
      icon: <FaLinkedinIn size={24} />,
      className: 'text-blue-600 hover:text-blue-700',
      title: 'Share on LinkedIn',
    },
  ]

  return (
    <div className="flex space-x-4 items-center">
      {platforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform.title}
          title={platform.title}
          className={platform.className}
        >
          {platform.icon}
        </a>
      ))}
    </div>
  )
}

export default function PostHeader(
  props: Pick<Post, 'title' | 'date' | 'author' | 'youtubeEmbed'>,
) {
  const { title, date, author, youtubeEmbed } = props
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const url = `${baseUrl}${window.location.pathname}`
      setCurrentUrl(url)
    }
  }, [])

  const shareUrls = useMemo(() => {
    return {
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
        {/* Responsive container: on desktop, avatar and share options are side by side; on mobile, share options are centered */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          {author && <Avatar name={author.name} picture={author.picture} />}
          <div className="mt-4 mx-auto md:mt-0 md:mx-0">
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
