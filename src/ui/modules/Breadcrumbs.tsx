import CTA from '@/ui/CTA'
import { stegaClean } from 'next-sanity'
import { Fragment } from 'react'

export default async function Breadcrumbs({
	crumbs,
	hideCurrent,
	currentPage,
}: Partial<{
	crumbs: Sanity.Link[]
	hideCurrent?: boolean
	currentPage: Sanity.Page | Sanity.BlogPost
}>) {
	const baseIndex = crumbs?.length ?? 0
	const category = currentPage?.categories?.[0]
	const categoryCrumb: Sanity.Link | undefined = category
		? {
				_type: 'link',
				type: 'internal',
				label: category?.title,
				internal: {
					...category,
				},
			}
		: undefined

	return (
		<nav className="section py-4 text-sm">
			<ol
				className="flex flex-wrap items-center gap-x-2 gap-y-1"
				itemScope
				itemType="https://schema.org/BreadcrumbList"
			>
				{crumbs?.map((crumb, key) => (
					<Fragment key={key}>
						<Crumb link={crumb} position={key + 1} />
						{(key < crumbs.length - 1 || !hideCurrent) && renderSeparator(key)}
					</Fragment>
				))}

				{categoryCrumb && (
					<Fragment>
						<Crumb link={categoryCrumb} position={baseIndex + 1} />
						{renderSeparator(baseIndex + 1)}
					</Fragment>
				)}

				<Crumb
					position={baseIndex + (categoryCrumb ? 2 : 1)}
					hidden={hideCurrent}
				>
					{currentPage?.title ?? currentPage?.metadata?.title}
				</Crumb>
			</ol>
		</nav>
	)
}

const renderSeparator = (key: number) => (
	<li key={`sep-${key}`} className="text-ink/20" role="presentation">
		/
	</li>
)

function Crumb({
	link,
	position,
	children,
	hidden,
}: {
	link?: Omit<Sanity.Link, '_type'>
	position: number
	hide?: boolean
} & React.ComponentProps<'li'>) {
	const content = (
		<>
			<span itemProp="name" hidden={hidden}>
				{stegaClean(
					children || link?.label || link?.internal?.title || link?.external,
				)}
			</span>
			<meta itemProp="position" content={position.toString()} />
		</>
	)

	return (
		<li
			className="line-clamp-1"
			itemProp="itemListElement"
			itemScope
			itemType="https://schema.org/ListItem"
		>
			{link ? (
				<CTA
					className="hover:underline"
					link={{ _type: 'link', ...link }}
					itemProp="item"
				>
					{content}
				</CTA>
			) : (
				content
			)}
		</li>
	)
}
