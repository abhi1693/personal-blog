import Avatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'

import { urlForImage } from '../lib/sanity.image'
import ShareOptions from './ShareOptions'
import YouTubeEmbed from './YouTubeEmbed'

export default function PostHeader(
  props: Pick<
    Post,
    'title' | 'date' | 'author' | 'youtubeEmbed' | 'coverImage'
  > & {
    postUrl: string
  },
) {
  const { title, date, author, youtubeEmbed, postUrl } = props

  return (
    <>
      <PostTitle>{title}</PostTitle>
      {youtubeEmbed?.url && (
        <div className="mb-8 sm:mx-0 md:mb-16">
          <YouTubeEmbed
            url={youtubeEmbed.url}
            thumbnailUrl={urlForImage(props.coverImage)
              .width(1280)
              .height(720)
              .url()}
          />
        </div>
      )}
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          {author && <Avatar name={author.name} picture={author.picture} />}
          <div className="mt-4 mx-auto md:mt-0 md:mx-0">
            <ShareOptions url={postUrl} title={title} />
          </div>
        </div>
        <div className="mb-6 text-lg flex-grow">
          <Date dateString={date} />
        </div>
      </div>
    </>
  )
}
