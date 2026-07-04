import css from './toc.module.css'
import ToCItem from './toc-item'
import { cn } from '@/lib/utils'
import MobileClosedDetails from '@/ui/details/mobile-closed-details'
import { VscChevronDown } from 'react-icons/vsc'

export type ToCHeadings = Array<{
	style: string | null
	text: string | null
}> | null

export default function TableOfContents({
	summary = 'Table of Contents',
	headings,
	className,
	...props
}: {
	summary?: string
	headings: ToCHeadings
} & React.ComponentProps<'details'>) {
	if (!headings?.length) return null

	return (
		<MobileClosedDetails
			className={cn(
				'table-of-contents max-h-[calc(100svh-var(--header-height)-var(--offset,1rem))] overflow-y-auto',
				className,
			)}
			{...props}
		>
			<summary className="bg-canvas sticky top-0 z-1 flex items-center justify-between gap-2 py-1 font-bold">
				{summary}
				<VscChevronDown className="md:hidden" />
			</summary>

			<ol className={cn(css.list, 'leading-tight')}>
				{headings.map((heading, key) => (
					<ToCItem heading={heading} key={key} />
				))}
			</ol>
		</MobileClosedDetails>
	)
}
