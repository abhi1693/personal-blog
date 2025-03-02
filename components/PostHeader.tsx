import Avatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import YouTubeEmbed from 'components/YouTubeEmbed'
import type { Post } from 'lib/sanity.queries'

import ShareOptions from './ShareOptions'

export default function PostHeader(
  props: Pick<Post, 'title' | 'date' | 'author' | 'youtubeEmbed'> & {
    postUrl: string
  },
) {
  const { title, date, author, youtubeEmbed, postUrl } = props

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
            <ShareOptions url={postUrl} title={title} />
          </div>
        </div>
        <div className="mb-6 text-lg">
          <Date dateString={date} />
        </div>
      </div>
    </>
  )
}
