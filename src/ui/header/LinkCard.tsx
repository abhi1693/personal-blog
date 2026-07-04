import { Img } from '@/ui/Img'
import CTA from '@/ui/CTA'
import { PortableText } from 'next-sanity'

export default function LinkCard({ image, link, content }: Sanity.LinkCard) {
	const label = link?.label || link?.internal?.title

	return (
		<figure className="relative mb-5 break-inside-avoid space-y-2 md:max-w-md">
			<Img
				className="aspect-video w-full rounded object-cover max-md:hidden"
				image={image}
				width={500}
				alt={label || ''}
			/>

			<figcaption className="grid gap-1">
				<CTA
					className="after:absolute after:inset-0 hover:link py-1 font-medium"
					link={link}
				/>

				{content && (
					<div className="prose text-ink/70 text-sm max-md:hidden">
						<PortableText value={content} />
					</div>
				)}
			</figcaption>
		</figure>
	)
}
