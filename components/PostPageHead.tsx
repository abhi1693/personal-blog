import { urlForImage } from 'lib/sanity.image'
import { Post, Settings } from 'lib/sanity.queries'
import { stegaClean } from 'next-sanity'

import MetaHead from './MetaHead'
import PostSchemaMarkup from './PostSchemaMarkup'
import { getBaseUrl } from './utils/getBaseUrl'

export interface PostPageHeadProps {
  settings: Settings
  post: Post
}

export default function PostPageHead({ settings, post }: PostPageHeadProps) {
  const imageUrl = urlForImage(post.coverImage)
    .width(1200)
    .height(627)
    .fit('fill')
    .url()
  const postUrl = `${getBaseUrl()}/posts/${post.slug}`

  return (
    <MetaHead
      title={post.title}
      site_name={stegaClean(settings.title)}
      description={post.excerpt}
      imageUrl={imageUrl}
      url={postUrl}
    >
      <PostSchemaMarkup post={post} />
    </MetaHead>
  )
}
