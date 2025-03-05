import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useCdn,
} from 'lib/sanity.api'
import {
  allSeriesQuery,
  allSeriesSlugsQuery,
  indexQuery,
  type Post,
  postAndMorePostsQuery,
  postBySlugQuery,
  postSlugsQuery,
  seriesBySlugQuery,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity'

/**
 * Returns a new Sanity client instance.
 * If a preview token is provided, returns a client configured for draft content.
 */
export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
    stega: {
      enabled: !!preview?.token,
      studioUrl,
    },
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'drafts',
    })
  }
  return client
}

export const getSanityImageConfig = () => getClient()

/**
 * Fetch settings from Sanity with caching enabled.
 */
export async function getSettings(client?: SanityClient): Promise<Settings> {
  const c = client || getClient()
  return (
    (await c.fetch(settingsQuery, undefined, { cache: 'force-cache' })) || {}
  )
}

/** Fetch all series with caching enabled */
export async function getAllSeries() {
  const client = getClient()
  return await client.fetch(allSeriesQuery, undefined, { cache: 'force-cache' })
}

/** Fetch all series slugs for dynamic routes with caching enabled */
export async function getAllSeriesSlugs() {
  const client = getClient()
  return await client.fetch(allSeriesSlugsQuery, undefined, {
    cache: 'force-cache',
  })
}

/** Fetch a single series by slug with posts with caching enabled */
export async function getSeriesBySlug(slug: string) {
  const client = getClient()
  return await client.fetch(
    seriesBySlugQuery,
    { slug },
    { cache: 'force-cache' },
  )
}

/** Fetch all posts with caching enabled */
export async function getAllPosts(client: SanityClient): Promise<Post[]> {
  return (
    (await client.fetch(indexQuery, undefined, { cache: 'force-cache' })) || []
  )
}

/** Fetch all post slugs with caching enabled */
export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  const client = getClient()
  const slugs =
    (await client.fetch<string[]>(postSlugsQuery, undefined, {
      cache: 'force-cache',
    })) || []
  return slugs.map((slug) => ({ slug }))
}

/** Fetch a single post by slug with caching enabled */
export async function getPostBySlug(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return (
    (await client.fetch(postBySlugQuery, { slug }, { cache: 'force-cache' })) ||
    ({} as any)
  )
}

/** Fetch a post and related posts with caching enabled */
export async function getPostAndMorePosts(
  client: SanityClient,
  slug: string,
): Promise<{ post: Post; morePosts: Post[] }> {
  return await client.fetch(
    postAndMorePostsQuery,
    { slug },
    { cache: 'force-cache' },
  )
}
