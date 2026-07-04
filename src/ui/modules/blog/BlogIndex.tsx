import BlogFrontpage from './BlogFrontpage'
import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import { PortableText } from 'next-sanity'

export default function BlogIndex({
	intro,
	postsPerPage,
	currentPage,
	...props
}: Partial<{
	intro: any
	postsPerPage: number
	currentPage: Sanity.BlogPost | Sanity.Page
}> &
	Sanity.Module) {
	return (
		<div {...moduleProps(props)}>
			{intro && (
				<header className="section richtext">
					<PortableText value={intro} />
				</header>
			)}
			<BlogFrontpage
				itemsPerPage={postsPerPage}
				mainPost="recent"
				showFeaturedPostsFirst={false}
				currentPage={currentPage}
			/>
			<ModuleScopedCss {...props} />
		</div>
	)
}
