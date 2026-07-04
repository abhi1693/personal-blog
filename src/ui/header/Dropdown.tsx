import { cn } from '@/lib/utils'
import CTA from '@/ui/CTA'
import HoverDetails from '@/ui/details/hover-details'
import { VscChevronDown } from 'react-icons/vsc'

export default function Dropdown({
	link,
	links,
	summaryClassName,
}: Sanity.LinkList & { summaryClassName?: string }) {
	return (
		<HoverDetails
			className="group/dropdown relative"
			name="header"
			delay={10}
			closeAfterNavigate
			safeAreaOnHover
		>
			<summary
				className={cn(
					summaryClassName,
					'flex h-full items-center gap-1 group-open/dropdown:max-md:font-bold',
				)}
			>
				{link?.label || link?.internal?.title}
				<VscChevronDown className="shrink-0 transition-transform group-open/dropdown:rotate-180" />
			</summary>

			<ul className="anim-fade-to-b md:frosted-glass md:bg-canvas border-ink/10 top-full left-0 z-20 mb-2 px-3 py-2 leading-tight max-md:ms-3 max-md:border-s md:absolute md:min-w-max md:rounded md:border md:shadow-md">
				{links?.map((link, key) => (
					<li key={link._key || key}>
						<CTA className="hover:link inline-block py-1" link={link} />
					</li>
				))}
			</ul>
		</HoverDetails>
	)
}
