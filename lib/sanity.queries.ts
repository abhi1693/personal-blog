import groq from 'groq'

const postFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
  youtubeEmbed,
  keywords
`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`

export const allSeriesQuery = groq`
*[_type == "series"]{
  _id,
  title,
  "slug": slug.current,
  description,
  coverImage
}
`

// Get all series slugs for dynamic paths
export const allSeriesSlugsQuery = groq`
*[_type == "series" && defined(slug.current)][].slug.current
`

// Get a single series by slug with related posts
export const seriesBySlugQuery = groq`
*[_type == "series" && slug.current == $slug][0]{
  title,
  description,
  coverImage,
  "posts": *[_type == "post" && references(^._id)]{
    _id,
    title,
    "slug": slug.current,
    coverImage,
    excerpt,
    date
  }
}
`

export const postAndMorePostsQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`

export interface Author {
  name?: string
  picture?: any
}

export interface YouTubeEmbed {
  url: string
}

export interface Post {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
  youtubeEmbed: YouTubeEmbed
  keywords?: string[]
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}
