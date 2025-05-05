import css from './Header.module.css'
import Navigation from './Navigation'
import Toggle from './Toggle'
import Wrapper from './Wrapper'
import { cn } from '@/lib/utils'
import { getSite } from '@/sanity/lib/queries'
import CTAList from '@/ui/CTAList'
import { Img } from '@/ui/Img'
import Link from 'next/link'

export default async function Header() {
	const { title, logo, ctas } = await getSite()
	const logoImage = logo?.image?.dark || logo?.image?.default

	return (
		<Wrapper className="frosted-glass border-ink/10 bg-canvas max-md:header-open:shadow-lg sticky top-0 z-10 border-b">
			<div
				className={cn(
					css.header,
					'mx-auto grid max-w-screen-xl items-center gap-x-6 p-4',
				)}
			>
				<div className="[grid-area:logo] flex items-center gap-2">
					<Link
						href="/"
						className={cn(
							'flex items-center gap-2',
							logo?.image && 'max-w-3xs',
						)}
					>
						{logoImage && (
							<Img
								className="inline-block max-h-[1.2em] w-auto"
								image={logoImage}
								alt={logo?.name || title}
							/>
						)}
						<span className="text-lg font-semibold text-ink">{title}</span>
					</Link>
				</div>

				<Navigation />

				<CTAList
					ctas={ctas}
					className="max-md:header-closed:hidden [grid-area:ctas] max-md:*:w-full md:ms-auto"
				/>

				<Toggle />
			</div>
		</Wrapper>
	)
}
