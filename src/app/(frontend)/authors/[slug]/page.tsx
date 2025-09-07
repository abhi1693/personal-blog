import { BASE_URL } from '@/lib/env'
import { DEFAULT_LANG, langCookieName } from '@/lib/i18n'
import resolveUrl from '@/lib/resolveUrl'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import { Img } from '@/ui/Img'
import PostPreview from '@/ui/modules/blog/PostPreview'
import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import { groq } from 'next-sanity'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export const revalidate = 86400

export default async function Page({ params }: Props) {
	const { slug } = await params
	const lang = (await cookies()).get(langCookieName)?.value ?? DEFAULT_LANG

	const author = await getAuthor(slug)
	if (!author) notFound()

	const posts = await getAuthorPosts(slug, lang)

	return (
		<section className="space-y-12">
			{/* Hero */}
			<header className="relative isolate">
				{author.coverImage && (
					<figure className="max-md:full-bleed bg-ink/5 relative h-48 w-full overflow-hidden md:h-60">
						<Img
							className="h-full w-full object-cover"
							image={author.coverImage}
							width={1600}
							alt={author.name}
						/>
					</figure>
				)}

				<div className="section -mt-10 flex items-center gap-4">
					<div className="bg-accent/3 grid aspect-square w-20 shrink-0 place-content-center overflow-hidden rounded-full ring-2 ring-white">
						{author.image ? (
							<Img
								className="aspect-square"
								image={author.image}
								width={120}
								alt={author.name}
							/>
						) : null}
					</div>
					<div className="space-y-2">
						<h1 className="h2 m-0">{author.name}</h1>
						<p className="text-sm leading-tight text-gray-600">
							{[author.title, author.company, author.location]
								.filter(Boolean)
								.join(' • ')}
						</p>
						{author.tagline || author.socials?.length ? (
							<p className="flex flex-wrap items-center gap-x-1.5 text-sm leading-tight text-gray-700">
								{author.tagline && <span>{author.tagline}</span>}
								{author.socials
									?.map((s) => ({
										href:
											s?.type === 'external'
												? s?.external
												: resolveUrl(s?.internal),
										label:
											s?.label ||
											(s?.type === 'external' ? s?.external : 'Link'),
									}))
									.filter((x) => !!x?.href)
									.map((x, i) => (
										<span key={i} className="flex items-center gap-2">
											{author.tagline && i === 0 && <span aria-hidden>•</span>}
											<a
												className="hover:underline text-primary"
												href={x.href as string}
												target="_blank"
												rel="noopener noreferrer"
											>
												{x.label}
											</a>
										</span>
									))}
							</p>
						) : null}
					</div>
				</div>
			</header>

			{/* About */}
			{author.bio?.length && (
				<section className="section space-y-4">
					<h2 className="h4">About</h2>
					<div className="richtext">
						<PortableText value={author.bio} />
					</div>
				</section>
			)}

			{/* Featured posts */}
			{author.featuredPosts?.length ? (
				<section className="section space-y-4">
					<h2 className="h4">Featured Posts</h2>
					<ul className="grid gap-x-8 gap-y-12 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
						{author.featuredPosts.map((post) => (
							<li key={post._id} className="anim-fade">
								<PostPreview post={post} />
							</li>
						))}
					</ul>
				</section>
			) : null}

			{/* Featured books */}
			{author.featuredBooks?.length ? (
				<section className="section space-y-4">
					<h2 className="h4">Featured Books</h2>
					<ul className="grid gap-x-8 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
						{author.featuredBooks.map((book) => (
							<li key={book._id} className="space-y-1 group">
								{book.image && (
									<a
										href={book.defaultLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Img
											className="aspect-[3/4] w-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
											image={book.image}
											width={320}
											alt={book.title}
										/>
									</a>
								)}
							</li>
						))}
					</ul>
				</section>
			) : null}

			{/* All posts */}
			<section className="section space-y-4">
				<div className="flex items-baseline justify-between">
					<h2 className="h4">All Posts</h2>
					<p className="text-xs text-gray-600">{posts.length} total</p>
				</div>
				{posts.length ? (
					<ul className="grid gap-x-8 gap-y-12 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
						{posts.map((post) => (
							<li key={post._id} className="anim-fade">
								<PostPreview post={post} />
							</li>
						))}
					</ul>
				) : (
					<p>No posts found for this author.</p>
				)}
			</section>

			{/* JSON-LD Person */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(personJsonLd(author, slug)),
				}}
			/>
		</section>
	)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'person' && defined(slug.current)].slug.current`,
	)
	return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const author = await getAuthor(slug)
	if (!author) return {}

	const title = `${author.name} — Author`
	const description = author.tagline || `Articles and posts by ${author.name}`
	const url = `${BASE_URL}/authors/${slug}`

	const ogSource = author.coverImage || author.image
	const ogUrl = ogSource
		? urlFor(ogSource as any)
				.width(1200)
				.height(630)
				.fit('crop')
				.url()
		: undefined

	return {
		title,
		description,
		robots: { index: true, follow: true },
		openGraph: {
			type: 'profile',
			url,
			title,
			description,
			images: ogUrl,
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ogUrl,
		},
		alternates: {
			canonical: url,
		},
	}
}

async function getAuthor(slug: string) {
	return await fetchSanityLive<Sanity.Person | null>({
		query: groq`*[_type == 'person' && slug.current == $slug][0]{
      _id,
      name,
      slug,
      image { ${IMAGE_QUERY} },
      // profile
      title, tagline, location, company,
      socials[]{ ... },
      // content
      bio[],
      coverImage { ${IMAGE_QUERY} },
      featuredPosts[]->{
        _id,
        featured,
        categories[]->,
        authors[]->,
        publishDate,
        language,
        metadata { ..., image { ${IMAGE_QUERY} } }
      },
      featuredBooks[]->{
        _id,
        title,
        defaultLink,
        image { ${IMAGE_QUERY} },
        authors[]->
      },
      // seo
    }`,
		params: { slug },
	})
}

async function getAuthorPosts(slug: string, lang?: string) {
	return await fetchSanityLive<Sanity.BlogPost[]>({
		query: groq`*[
      _type == 'blog.post'
      && count(authors[@->slug.current == $slug]) > 0
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
		params: { slug },
	})
}

type Props = {
	params: Promise<{ slug: string }>
}

function personJsonLd(author: Sanity.Person, slug: string) {
	const imageUrl = author.image
		? urlFor(author.image).width(400).height(400).url()
		: undefined
	const url = `${BASE_URL}/authors/${slug}`
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: author.name,
		url,
		image: imageUrl,
		jobTitle: author.title,
		worksFor: author.company
			? { '@type': 'Organization', name: author.company }
			: undefined,
		sameAs: (author.socials || [])
			.map((s: any) => (s?.type === 'external' ? s?.external : undefined))
			.filter(Boolean),
	}
}
