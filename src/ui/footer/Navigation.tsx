import { getSite } from '@/sanity/lib/queries'
import CTA from '@/ui/CTA'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'

export default async function Menu() {
	const { footerMenu } = await getSite()

	const containsAuthors = footerMenu?.items?.some((item: any) => {
		if (item?._type !== 'link') return false
		const l = item.link
		if (!l) return false
		if (l.type === 'external') return l.external?.endsWith('/authors')
		if (l.type === 'internal')
			return l.internal?.metadata?.slug?.current === 'authors'
		return false
	})

	return (
		<nav className="flex flex-wrap items-start gap-x-12 gap-y-6 max-sm:flex-col">
			{footerMenu?.items?.map((item, key) => {
				switch (item._type) {
					case 'link':
						return <CTA className="hover:link" link={item} key={key} />

					case 'link.list':
						return (
							<div className="space-y-2 text-start" key={key}>
								<div className="technical text-canvas/50 text-xs">
									<CTA link={item.link}>
										{stegaClean(item.link?.label) || item.link?.internal?.title}
									</CTA>
								</div>

								<ul>
									{item.links?.map((link, key) => (
										<li key={key}>
											<CTA
												className="inline-block py-px hover:underline"
												link={link}
											/>
										</li>
									))}
								</ul>
							</div>
						)

					default:
						return null
				}
			})}

			{!containsAuthors && (
				<Link href="/authors" className="hover:link">
					Authors
				</Link>
			)}
		</nav>
	)
}
