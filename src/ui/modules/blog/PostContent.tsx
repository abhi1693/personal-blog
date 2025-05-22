import Authors from './Authors'
import Categories from './Categories'
import css from './PostContent.module.css'
import ReadTime from './ReadTime'
import { BASE_URL } from '@/lib/env'
import moduleProps from '@/lib/moduleProps'
import { articleJsonLd } from '@/lib/processJsonLd'
import { cn } from '@/lib/utils'
import Date from '@/ui/Date'
import ShareButtons from '@/ui/ShareButtons'
import SubscriberForm from '@/ui/SubscriberForm'
import YouTubeEmbed from '@/ui/YouTubeEmbed'
import Content from '@/ui/modules/RichtextModule/Content'
import TableOfContents from '@/ui/modules/RichtextModule/TableOfContents'

export default function PostContent({
	post,
	...props
}: { post?: Sanity.BlogPost } & Sanity.Module) {
	if (!post) return null

	const showTOC = !post.hideTableOfContents || !!post.headings?.length
	const showYouTube = post.youtubeEmbed?.videoID
	const jsonLd = articleJsonLd(post)

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
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

				<div
					className={cn(
						'section grid gap-8',
						(showTOC || post.youtubeEmbed) && 'lg:grid-cols-[1fr_auto]',
					)}
				>
					<aside className="lg:sticky-below-header mx-auto w-full max-w-lg self-start [--offset:1rem] lg:order-1 lg:w-3xs">
						{showTOC && <TableOfContents headings={post.headings} />}
						<>
							<ShareButtons
								url={`${BASE_URL}/posts/${post.metadata.slug.current}`}
								title={post.metadata.title}
							/>
							<div className="my-6 border-t border-gray-200" />
							<SubscriberForm />
							<div className="my-6 border-t border-gray-200" />
						</>
					</aside>

					<div className="grid gap-8 max-w-screen-md">
						{showYouTube && (
							<YouTubeEmbed
								videoId={post.youtubeEmbed.videoID}
								title={post.metadata.title}
							/>
						)}

						<Content value={post.body} className={cn(css.body)} />
					</div>
				</div>
			</article>
		</>
	)
}
