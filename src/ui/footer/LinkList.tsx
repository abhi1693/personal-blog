import { cn } from '@/lib/utils'
import CTA from '@/ui/CTA'
import { stegaClean } from 'next-sanity'

export default function LinkList({
	link,
	links,
	className,
}: Sanity.LinkList & React.ComponentProps<'li'>) {
	return (
		<li className={cn('grid gap-1 text-start', className)}>
			{link && (
				<div className="technical text-canvas/50 text-xs">
					<CTA className="hover:underline" link={link}>
						{stegaClean(link.label) || link.internal?.title}
					</CTA>
				</div>
			)}

			<ul className="leading-tight">
				{links?.map((link, key) => (
					<li key={link._key || key}>
						<CTA className="inline-block py-px hover:underline" link={link} />
					</li>
				))}
			</ul>
		</li>
	)
}
