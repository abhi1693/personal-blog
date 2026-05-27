import Authors from './Authors'
import css from './PostContent.module.css'
import moduleProps from '@/lib/moduleProps'
import { articleJsonLd } from '@/lib/processJsonLd'
import { cn } from '@/lib/utils'
import Date from '@/ui/Date'
import YouTubeEmbed from '@/ui/YouTubeEmbed'
import AccordionList from '@/ui/modules/AccordionList'
import Content from '@/ui/modules/RichtextModule/Content'
import PostSidebar from '@/ui/modules/blog/PostSidebar'

export default function PostContent({
	post,
	...props
}: { post?: Sanity.BlogPost } & Sanity.Module) {
	if (!post) return null

	const showYouTube = post.youtubeEmbed?.videoID
	const jsonLdArticle = articleJsonLd(post)

	return (
		<>
			{/* JSON-LD for SEO */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
			/>
			{/* Main article content */}
			<article {...moduleProps(props)}>
				<header className="section space-y-5 text-center">
					{/* Block 1: Title + optional dek */}
					<h1 className="h1 text-balance">{post.metadata.title}</h1>
					{post.metadata.description && (
						<p className="mx-auto max-w-prose text-pretty text-base text-gray-600">
							{post.metadata.description}
						</p>
					)}

					{/* Block 2: Centered meta (Date | By Author[s]) */}
					<div className="mx-auto max-w-screen-md text-gray-600">
						<div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">
							<Date value={post.publishDate} long />
							{post.authors?.length ? (
								<>
									<span aria-hidden>|</span>
									<Authors
										className="inline-flex items-center gap-3"
										authors={post.authors}
										linked
									/>
								</>
							) : null}
						</div>
						{/* Share removed */}
					</div>
				</header>

				<div className={cn('section grid gap-8', 'lg:grid-cols-[1fr_auto]')}>
					<PostSidebar post={post} />

					<div className="grid gap-8 max-w-screen-md">
						{showYouTube && (
							<YouTubeEmbed
								videoId={post.youtubeEmbed.videoID}
								title={post.metadata.title}
							/>
						)}

						<Content value={post.body} className={cn(css.body)} />
						{!post.faq?.options?.hidden && post.faq?.items && (
							<AccordionList {...post.faq} />
						)}
					</div>
				</div>
			</article>
		</>
	)
}
