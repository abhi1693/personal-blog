import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { Img } from '@/ui/Img'
import Pretitle from '@/ui/Pretitle'
import { PortableText, stegaClean } from 'next-sanity'

export default function QuoteList({
	eyebrow,
	intro,
	quotes,
	layout: l = 'grid',
	columns,
	...props
}: Partial<{
	eyebrow: string
	intro: any
	quotes: Array<{
		_id: string
		quote?: any
		author?: {
			name?: string
			title?: string
			image?: Sanity.Image
		}
	}>
	layout: 'grid' | 'carousel'
	columns: number
}> &
	Sanity.Module) {
	const layout = stegaClean(l)

	return (
		<section className="section space-y-8" {...moduleProps(props)}>
			{(eyebrow || intro) && (
				<header className="richtext text-center">
					<Pretitle>{eyebrow}</Pretitle>
					<PortableText value={intro} />
				</header>
			)}

			<div
				className={cn(
					'gap-6',
					layout === 'carousel'
						? 'carousel max-md:full-bleed auto-rows-fr pb-4 max-md:px-4'
						: columns
							? 'grid md:grid-cols-[repeat(var(--columns),minmax(0,1fr))]'
							: 'grid md:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]',
				)}
				style={{ '--columns': columns } as React.CSSProperties}
			>
				{quotes?.map((quote) => (
					<article
						className="bg-canvas flex flex-col gap-4 rounded border p-4 shadow-sm"
						key={quote._id}
					>
						<blockquote className="richtext grow">
							<PortableText value={quote.quote} />
						</blockquote>

						{quote.author?.name && (
							<cite className="flex items-center gap-3 not-italic">
								<Img
									className="size-10 shrink-0 rounded-full object-cover"
									image={quote.author.image}
									width={80}
									alt={quote.author.name}
								/>
								<span>
									<span className="block font-medium">{quote.author.name}</span>
									{quote.author.title && (
										<span className="text-ink/60 block text-sm">
											{quote.author.title}
										</span>
									)}
								</span>
							</cite>
						)}
					</article>
				))}
			</div>

			<ModuleScopedCss {...props} />
		</section>
	)
}
