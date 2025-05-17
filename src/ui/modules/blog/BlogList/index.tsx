import PostPreview from '../PostPreview'
import List from './List'
import { DEFAULT_LANG, langCookieName } from '@/lib/i18n'
import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import Pretitle from '@/ui/Pretitle'
import FilterList from '@/ui/modules/blog/BlogList/FilterList'
import { groq } from 'next-sanity'
import { PortableText, stegaClean } from 'next-sanity'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default async function BlogList({
	pretitle,
	intro,
	layout,
	limit,
	showFeaturedPostsFirst,
	displayFilters,
	filteredCategory,
	filterBySameCategory,
	...props
}: Partial<{
	pretitle: string
	intro: any
	layout: 'grid' | 'carousel'
	limit: number
	showFeaturedPostsFirst: boolean
	displayFilters: boolean
	filteredCategory: Sanity.BlogCategory
	post: Sanity.BlogPost
	filterBySameCategory: boolean
}> &
	Sanity.Module) {
	const lang = (await cookies()).get(langCookieName)?.value ?? DEFAULT_LANG
	const { post } = props
	const categoryMatchCondition =
		filterBySameCategory && post?.categories?.length
			? post.categories
					.map((_, i) => `$categoryIds[${i}] in categories[]->._id`)
					.join(' || ')
			: ''

	const posts = await fetchSanityLive<Sanity.BlogPost[]>({
		query: groq`
			*[
				_type == 'blog.post'
				&& metadata.slug.current != $currentSlug
				${!!lang ? `&& (!defined(language) || language == '${lang}')` : ''}
				${!!filteredCategory ? `&& $filteredCategory in categories[]->._id` : ''}
				${categoryMatchCondition ? `&& (${categoryMatchCondition})` : ''}
			]|order(
				${showFeaturedPostsFirst ? 'featured desc, ' : ''}
				publishDate desc
			)
			${limit ? `[0...${limit}]` : ''}
			{
				...,
				categories[]->,
				authors[]->,
				metadata{
					...,
					image { ${IMAGE_QUERY} }
				}
			}
		`,
		params: {
			filteredCategory: filteredCategory?._id || '',
			limit: limit ?? 0,
			currentSlug: post?.metadata?.slug?.current || '',
			categoryIds: post?.categories?.map((cat) => cat._id) || [],
		},
	})

	const listClassName = cn(
		'items-stretch gap-x-8 gap-y-12',
		stegaClean(layout) === 'grid'
			? 'grid md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'
			: 'carousel max-xl:full-bleed md:overflow-fade-r pb-4 [--size:320px] max-xl:px-4',
	)

	return (
		<section className="section space-y-8" {...moduleProps(props)}>
			{intro && (
				<header className="richtext">
					<Pretitle>{pretitle}</Pretitle>
					<PortableText value={intro} />
				</header>
			)}

			{displayFilters && !filteredCategory && <FilterList />}

			<Suspense
				fallback={
					<ul className={listClassName}>
						{Array.from({ length: limit ?? 6 }).map((_, i) => (
							<li key={i}>
								<PostPreview skeleton />
							</li>
						))}
					</ul>
				}
			>
				<List posts={posts} className={listClassName} />
			</Suspense>
		</section>
	)
}
