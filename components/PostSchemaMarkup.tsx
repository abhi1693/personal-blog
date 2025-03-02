import { createImgUrl } from '@operationnation/sanity-plugin-schema-markup'
import { NextSchemaScript } from '@operationnation/sanity-plugin-schema-markup/nextSchemaScript'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const PostSchemaMarkup = ({ post }) => {
  const { getImgUrl } = createImgUrl(projectId, dataset)
  const articleSchemaType = {
    type: 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post._updatedAt,
    author: {
      type: 'Person',
      name: post.author.name,
    },
    image: [getImgUrl(post.coverImage?.asset?._ref)],
  }

  return (
    <NextSchemaScript
      schema={[articleSchemaType]}
      projectId={projectId as string}
      dataset={dataset as string}
    />
  )
}

export default PostSchemaMarkup
