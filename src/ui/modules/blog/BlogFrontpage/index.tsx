import FilterList from '../BlogList/FilterList'
import PostPreview from '../PostPreview'
import PostPreviewLarge from '../PostPreviewLarge'
import Paginated from './Paginated'
import sortFeaturedPosts from './sortFeaturedPosts'
import { DEFAULT_LANG, langCookieName } from '@/lib/i18n'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import { stegaClean } from 'next-sanity'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default async function BlogFrontpage({
	mainPost,
	showFeaturedPostsFirst,
	itemsPerPage,
	currentPage,
}: Partial<{
	mainPost: 'recent' | 'featured'
	showFeaturedPostsFirst: boolean
	itemsPerPage: number
	currentPage: Sanity.BlogPost | Sanity.Page
}>) {
	const lang = (await cookies()).get(langCookieName)?.value ?? DEFAULT_LANG

	const posts = await fetchSanityLive<Sanity.BlogPost[]>({
		query: groq`
			*[
				_type == 'blog.post'
				${!!lang ? `&& (!defined(language) || language == '${lang}')` : ''}
			]|order(publishDate desc){
				_type,
				_id,
				featured,
				categories[]->,
				authors[]->,
				publishDate,
				language,
				metadata {
					...,
					image { ${IMAGE_QUERY} }
				},
			}
		`,
	})

	const [firstPost, ...otherPosts] =
		stegaClean(mainPost) === 'featured' ? sortFeaturedPosts(posts) : posts

	return (
		<section className="section space-y-12">
			<h1>
				<span className="text-3xl font-bold">
					Latest from Abhimanyu&#39;s Blog
				</span>
				<span className="text-sm text-gray-500">
					&nbsp;|&nbsp;{currentPage?.title || currentPage?.metadata?.title}
				</span>
			</h1>
			<PostPreviewLarge post={firstPost} />

			<hr />

			<FilterList />

			<Suspense
				fallback={
					<ul className="grid gap-x-8 gap-y-12 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
						{Array.from({ length: itemsPerPage ?? 6 }).map((_, i) => (
							<li key={i}>
								<PostPreview skeleton />
							</li>
						))}
					</ul>
				}
			>
				<Paginated
					posts={sortFeaturedPosts(otherPosts, showFeaturedPostsFirst)}
					itemsPerPage={itemsPerPage}
				/>
			</Suspense>
		</section>
	)
}
