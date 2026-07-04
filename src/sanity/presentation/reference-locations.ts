import { BLOG_DIR } from '@/lib/env'
import { groq } from 'next-sanity'
import { map } from 'rxjs'
import { getDraftId } from 'sanity'
import type {
	DocumentLocationResolver,
	DocumentLocationResolverObject,
	DocumentLocationResolvers,
	DocumentLocationsState,
} from 'sanity/presentation'

export function locationResolvers<
	T extends Record<
		string,
		| DocumentLocationResolverObject
		| DocumentLocationsState
		| DocumentLocationResolver
	>,
>(resolvers: T): DocumentLocationResolvers {
	return resolvers as DocumentLocationResolvers
}

export function referenceLocations(type: string): DocumentLocationResolver {
	return (params, { documentStore }) => {
		if (params.type !== type) return null

		const id = params.id
		const query = {
			fetch: groq`{
				'pages': *[_type == 'page' && references($id)] | order(title asc) {
					title,
					'slug': metadata.slug.current
				},
				'posts': *[_type == 'blog.post' && references($id)] | order(metadata.title asc) {
					'title': metadata.title,
					'slug': metadata.slug.current
				}
			}`,
			listen: `*[_id in [$id, $draftId] || references($id)]`,
		}
		const queryParams = { id, draftId: getDraftId(id) }

		return documentStore
			.listenQuery(query, queryParams, {
				perspective: 'drafts',
			})
			.pipe(
				map(
					(
						result: {
							pages?: { title?: string; slug?: string }[]
							posts?: { title?: string; slug?: string }[]
						} | null,
					) => {
						const pages = result?.pages ?? []
						const posts = result?.posts ?? []
						const locations = [
							...pages.map((page) => ({
								title: page.title || 'Untitled',
								href:
									!page.slug || page.slug === 'index' ? '/' : `/${page.slug}`,
							})),
							...posts.map((post) => ({
								title: post.title || 'Untitled',
								href: post.slug ? `/${BLOG_DIR}/${post.slug}` : `/${BLOG_DIR}`,
							})),
						]

						if (!locations.length) {
							return {
								message: 'Not used on any pages',
								tone: 'caution' as const,
							}
						}

						return { locations }
					},
				),
			)
	}
}
