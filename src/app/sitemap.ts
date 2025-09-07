import { BASE_URL, BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG } from '@/lib/i18n'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchSanityLive<{
    pages: MetadataRoute.Sitemap
    blog: MetadataRoute.Sitemap
    people: Array<{ slug: string; _updatedAt: string }>
  }>({
    query: groq`{
      'pages': *[
        _type == 'page' &&
        !(metadata.slug.current in ['404']) &&
        metadata.noIndex != true
      ]|order(metadata.slug.current){
        'url': (
          $baseUrl
          + select(defined(language) && language != $defaultLang => language + '/', '')
          + select(
            metadata.slug.current == 'index' => '',
            metadata.slug.current
          )
        ),
        'lastModified': _updatedAt,
        'priority': select(
          metadata.slug.current == 'index' => 1,
          0.5
        ),
      },
      'blog': *[_type == 'blog.post' && metadata.noIndex != true]|order(name){
        'url': (
          $baseUrl
          + select(defined(language) && language != $defaultLang => language + '/', '')
          + '${BLOG_DIR}/'
          + metadata.slug.current
        ),
        'lastModified': _updatedAt,
        'priority': select(featured == true => 0.8, 0.4),
      },
      'people': *[_type == 'person' && defined(slug.current)]|order(name asc){
        'slug': slug.current,
        '_updatedAt': _updatedAt
      }
    }`,
    params: {
      baseUrl: BASE_URL + '/',
      defaultLang: DEFAULT_LANG,
    },
  })

  const authorsIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/authors`,
      lastModified: new Date().toISOString(),
      priority: 0.5,
    },
  ]

  const authorProfiles: MetadataRoute.Sitemap = (data.people || []).map((p) => ({
    url: `${BASE_URL}/authors/${p.slug}`,
    lastModified: p._updatedAt,
    priority: 0.5,
  }))

  return [...data.pages, ...data.blog, ...authorsIndex, ...authorProfiles]
}
