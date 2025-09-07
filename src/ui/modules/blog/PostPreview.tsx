import Authors from './Authors'
import Categories from './Categories'
import resolveUrl from '@/lib/resolveUrl'
import { cn } from '@/lib/utils'
import Date from '@/ui/Date'
import { Img } from '@/ui/Img'
import Link from 'next/link'

export default function PostPreview({
  post,
  skeleton,
  href,
}: {
  post?: Sanity.BlogPost
  skeleton?: boolean
  href?: string
}) {
	if (!post && !skeleton) return null

	return (
		<div
			className="group relative isolate flex h-full flex-col space-y-2"
			itemType="https://schema.org/BlogPosting"
			itemScope
		>
			<figure className="bg-ink/3 relative aspect-video overflow-hidden">
				<Img
					className="aspect-video w-full object-cover transition-all group-hover:scale-105 group-hover:brightness-110"
					image={post?.metadata.image}
					width={400}
					alt={post?.metadata.title}
					itemProp="image"
				/>

				{post?.featured && (
					<span className="action absolute top-0 right-4 rounded-t-none py-1 text-xs shadow-md">
						Featured
					</span>
				)}
			</figure>

			<div className={cn('h4', skeleton && 'skeleton-2')}>
				<Link
					className="group-hover:underline"
					href={href || resolveUrl(post, { base: false })}
					itemProp="url"
				>
					<span className="absolute inset-0" />
					{post?.metadata.title}
				</Link>
			</div>

			<div className="grow">
				<p
					className="line-clamp-3 text-sm empty:h-[3lh]"
					itemProp="description"
				>
					{post?.metadata.description}
				</p>
			</div>

			{(post?.authors?.length || skeleton) && (
				<Authors
					className="flex flex-wrap items-center gap-4 text-sm"
					authors={post?.authors}
					skeleton={skeleton}
				/>
			)}

			<hr />

			<div className="empty:skeleton flex flex-wrap gap-x-4 text-sm">
				<Date value={post?.publishDate} itemProp="datePublished" />
				<Categories
					className="flex flex-wrap gap-x-2"
					categories={post?.categories}
				/>
			</div>
		</div>
	)
}
