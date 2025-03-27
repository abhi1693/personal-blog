import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { BASE_URL, BLOG_DIR } from '@/lib/env'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const data = await fetchSanityLive<Record<string, MetadataRoute.Sitemap>>({
		query: groq`{
			'pages': *[
				_type == 'page' &&
				!(metadata.slug.current in ['404']) &&
				metadata.noIndex != true
			]|order(metadata.slug.current){
				'url': (
					$baseUrl
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
					+ '${BLOG_DIR}/'
					+ metadata.slug.current
				),
				'lastModified': _updatedAt,
				'priority': 0.4
			}
		}`,
		params: {
			baseUrl: BASE_URL + '/',
		},
	})

	return Object.values(data).flat()
}
