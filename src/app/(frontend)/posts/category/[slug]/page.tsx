import { BASE_URL } from '@/lib/env'
import { DEFAULT_LANG, langCookieName } from '@/lib/i18n'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import PostPreview from '@/ui/modules/blog/PostPreview'
import type { Metadata } from 'next'
import { groq } from 'next-sanity'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export const revalidate = 86400

export default async function CategoryPage({ params }: Props) {
	const { slug } = await params
	const lang = (await cookies()).get(langCookieName)?.value ?? DEFAULT_LANG

	const category = await getCategory(slug)
	if (!category) notFound()

	const posts = await getCategoryPosts(category._id, lang)

	return (
		<section className="section space-y-8">
			<header className="text-center space-y-2">
				<h1 className="h2 m-0">{category.title}</h1>
				<p className="text-sm text-gray-600">{posts.length} posts</p>
			</header>

			{posts.length ? (
				<ul className="grid gap-x-8 gap-y-12 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
					{posts.map((post) => (
						<li key={post._id} className="anim-fade">
							<PostPreview post={post} />
						</li>
					))}
				</ul>
			) : (
				<p className="text-center text-gray-700">
					No posts in this category yet.
				</p>
			)}
		</section>
	)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'blog.category' && defined(slug.current)].slug.current`,
	)
	return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const category = await getCategory(slug)
	if (!category) return {}

	const title = `${category.title} — Posts`
	const description = `Articles and posts in the “${category.title}” category.`
	const url = `${BASE_URL}/posts/category/${slug}`

	return {
		title,
		description,
		robots: { index: true, follow: true },
		alternates: { canonical: url },
		openGraph: { url, title, description },
		twitter: { card: 'summary', title, description },
	}
}

async function getCategory(slug: string) {
	return await fetchSanityLive<{
		_id: string
		title: string
		slug: { current: string }
	} | null>({
		query: groq`*[_type == 'blog.category' && slug.current == $slug][0]{ _id, title, slug }`,
		params: { slug },
	})
}

async function getCategoryPosts(categoryId: string, lang?: string) {
	return await fetchSanityLive<Sanity.BlogPost[]>({
		query: groq`*[
      _type == 'blog.post'
      && $categoryId in categories[]->._id
      ${!!lang ? `&& (!defined(language) || language == '${lang}')` : ''}
    ]|order(publishDate desc){
      _id,
      featured,
      categories[]->,
      authors[]->,
      publishDate,
      language,
      metadata { ..., image { ${IMAGE_QUERY} } }
    }`,
		params: { categoryId },
	})
}

type Props = { params: Promise<{ slug: string }> }
