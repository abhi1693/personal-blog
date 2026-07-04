import Dropdown from './Dropdown'
import Megamenu from './Megamenu'
import { cn } from '@/lib/utils'
import { getSite } from '@/sanity/lib/queries'
import CTA from '@/ui/CTA'

export default async function Menu() {
	const { headerMenu } = await getSite()

	const topLevelClassName = cn(
		'grid py-1 leading-tight md:place-content-center md:px-3 md:py-2 md:text-center md:text-balance',
	)

	return (
		<nav
			className="max-md:anim-fade-to-r max-md:header-closed:hidden flex gap-y-2 [grid-area:nav] max-md:my-4 max-md:flex-col md:justify-center"
			role="navigation"
		>
			{headerMenu?.items?.map((item, key) => {
				switch (item._type) {
					case 'link':
						return (
							<CTA
								className={cn(
									topLevelClassName,
									'hover:link text-current',
								)}
								link={item}
								key={item._key || key}
							/>
						)

					case 'link.list':
						return (
							<Dropdown
								summaryClassName={topLevelClassName}
								{...item}
								key={item._key || key}
							/>
						)

					case 'megamenu':
						return (
							<Megamenu
								summaryClassName={topLevelClassName}
								{...item}
								key={item._key || key}
							/>
						)

					default:
						return null
				}
			})}
		</nav>
	)
}
