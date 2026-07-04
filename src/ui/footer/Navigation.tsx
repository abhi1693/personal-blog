import LinkList from './LinkList'
import { getSite } from '@/sanity/lib/queries'
import CTA from '@/ui/CTA'
import Link from 'next/link'

export default async function Menu() {
	const { footerMenu } = await getSite()

	const containsAuthors = footerMenu?.items?.some((item) =>
		getFooterLinks(item).some(isAuthorsLink),
	)

	return (
		<nav>
			<ul className="flex flex-wrap items-start gap-x-12 gap-y-6 max-sm:flex-col">
				{footerMenu?.items?.map((item, key) => {
					switch (item._type) {
						case 'link':
							return (
								<li key={item._key || key}>
									<CTA className="hover:link" link={item} />
								</li>
							)

						case 'link.list':
							return <LinkList {...item} key={item._key || key} />

						case 'megamenu':
							return <MegamenuFooterList {...item} key={item._key || key} />

						default:
							return null
					}
				})}

				{!containsAuthors && (
					<li>
						<Link href="/authors" className="hover:link">
							Authors
						</Link>
					</li>
				)}
			</ul>
		</nav>
	)
}

function MegamenuFooterList({ link, items }: Sanity.Megamenu) {
	const links = items
		?.flatMap((item) => {
			if (item._type === 'link') return item
			if (item._type === 'link.card') return item.link
			return []
		})
		.filter(Boolean) as Sanity.Link[] | undefined

	return (
		<li className="grid gap-4 text-start">
			<div className="grid gap-1">
				{link && (
					<div className="technical text-canvas/50 text-xs">
						<CTA className="hover:underline" link={link}>
							{link.label || link.internal?.title}
						</CTA>
					</div>
				)}

				{!!links?.length && (
					<ul className="leading-tight">
						{links.map((link, key) => (
							<li key={link._key || key}>
								<CTA
									className="inline-block py-px hover:underline"
									link={link}
								/>
							</li>
						))}
					</ul>
				)}
			</div>

			<ul className="grid gap-4">
				{items?.map((item, key) => {
					if (item._type !== 'link.list') return null
					return <LinkList {...item} key={item._key || key} />
				})}
			</ul>
		</li>
	)
}

function getFooterLinks(
	item: Sanity.Link | Sanity.LinkList | Sanity.Megamenu,
): Sanity.Link[] {
	if (item._type === 'link') return [item]
	if (item._type === 'link.list') return item.links || []
	if (item._type === 'megamenu') {
		return (
			item.items?.flatMap((entry) => {
				if (entry._type === 'link') return [entry]
				if (entry._type === 'link.list') return entry.links || []
				if (entry._type === 'link.card' && entry.link) return [entry.link]
				return []
			}) || []
		)
	}

	return []
}

function isAuthorsLink(link: Sanity.Link) {
	if (link.type === 'external') return link.external?.endsWith('/authors')
	if (link.type === 'internal') {
		if (link.internal?._type === 'blog.category') return false
		return link.internal?.metadata?.slug?.current === 'authors'
	}
	return false
}
