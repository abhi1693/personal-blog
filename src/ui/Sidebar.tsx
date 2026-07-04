import { cn } from '@/lib/utils'
import Callout from '@/ui/modules/Callout'
import CustomHTML from '@/ui/modules/CustomHTML'
import TableOfContents, { type ToCHeadings } from '@/ui/table-of-contents'
import { stegaClean } from 'next-sanity'

export default function Sidebar({
	modules,
	position: p,
	headings,
	className,
}: {
	headings: ToCHeadings
} & Partial<Sanity.Sidebar> &
	React.ComponentProps<'aside'>) {
	const position = stegaClean(p)

	if (!position || !modules?.length) return null

	return (
		<aside
			className={cn(
				'md:sticky-below-header space-y-6 shrink-0 self-start [--offset:1rem] md:w-64',
				position === 'right' && 'md:order-last',
				className,
			)}
		>
			{modules.map((module, key) => {
				switch (module._type) {
					case 'callout':
						return (
							<Callout
								{...module}
								className="p-0 text-start"
								key={module._key || key}
							/>
						)

					case 'custom-html':
						return <CustomHTML {...module} key={module._key || key} />

					case 'tableOfContents': {
						const maxHeadingDepth = stegaClean(module.maxHeadingDepth) ?? 6
						const filtered =
							headings?.filter((heading) => {
								const level = Number(stegaClean(heading.style)?.slice(1))
								return level >= 2 && level <= maxHeadingDepth
							}) ?? null

						return (
							<TableOfContents
								className="max-md:not-open:mb-0"
								summary={module.summary}
								headings={filtered}
								key={module._key || key}
							/>
						)
					}

					default:
						return null
				}
			})}
		</aside>
	)
}
