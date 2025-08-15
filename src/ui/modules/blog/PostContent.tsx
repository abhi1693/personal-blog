import Authors from './Authors'
import Categories from './Categories'
import css from './PostContent.module.css'
import ReadTime from './ReadTime'
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
				<header className="section space-y-6 text-center">
					<h1 className="h1 text-balance">{post.metadata.title}</h1>
					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
						<Date value={post.publishDate} />
						<Categories
							className="flex flex-wrap gap-x-2"
							categories={post.categories}
							linked
						/>
						<ReadTime value={post.readTime} />
					</div>

					{post.authors?.length && (
						<Authors
							className="flex flex-wrap items-center justify-center gap-4"
							authors={post.authors}
							linked
						/>
					)}
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
