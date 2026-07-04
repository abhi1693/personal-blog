import LinkCard from './LinkCard'
import { cn } from '@/lib/utils'
import CTA from '@/ui/CTA'
import HoverDetails from '@/ui/details/hover-details'
import MobileOnlyDetails from '@/ui/details/mobile-only-details'
import { VscChevronDown } from 'react-icons/vsc'

export default function Megamenu({
	link,
	items,
	summaryClassName,
}: Sanity.Megamenu & { summaryClassName?: string }) {
	return (
		<HoverDetails
			className="group/megamenu [--safearea-x:20vw]"
			name="header"
			delay={10}
			closeAfterNavigate
			safeAreaOnHover
		>
			<summary
				className={cn(
					summaryClassName,
					'flex h-full items-center gap-1 group-open/megamenu:max-md:font-bold',
				)}
			>
				{link?.label || link?.internal?.title}
				<VscChevronDown className="shrink-0 transition-transform group-open/megamenu:rotate-180" />
			</summary>

			<div className="anim-fade-to-b md:frosted-glass md:bg-canvas border-ink/10 inset-x-0 top-full z-20 max-md:ms-3 max-md:border-s md:absolute md:max-h-[calc(100vh-var(--header-height))] md:overflow-y-auto md:border-b md:shadow-lg">
				<div className="mx-auto max-w-screen-xl px-3 py-2 md:columns-3xs md:gap-8 md:px-4 md:py-8">
					{items?.map((item, key) => {
						switch (item._type) {
							case 'link':
								return (
									<CTA
										className="hover:link mb-2 block break-inside-avoid py-1 font-medium"
										link={item}
										key={item._key || key}
									/>
								)

							case 'link.list':
								return (
									<MobileOnlyDetails
										className="group/megamenu-linklist mb-5 break-inside-avoid space-y-1 py-1"
										name="megamenu-linklist"
										key={item._key || key}
									>
										<summary className="text-ink/60 relative flex items-center gap-1 text-sm font-medium md:cursor-default">
											<CTA
												className="after:absolute after:inset-0 hover:link"
												link={item.link}
											/>
											<VscChevronDown className="shrink-0 transition-transform group-open/megamenu-linklist:rotate-180 md:hidden" />
										</summary>

										<ul className="leading-tight max-md:ms-3 max-md:border-s max-md:ps-3">
											{item.links?.map((link, key) => (
												<li key={link._key || key}>
													<CTA
														className="hover:link inline-block py-1"
														link={link}
													/>
												</li>
											))}
										</ul>
									</MobileOnlyDetails>
								)

							case 'link.card':
								return <LinkCard {...item} key={item._key || key} />

							default:
								return null
						}
					})}
				</div>
			</div>
		</HoverDetails>
	)
}
