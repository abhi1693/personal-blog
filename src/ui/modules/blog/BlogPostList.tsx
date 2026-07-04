import BlogList from './BlogList'
import CTAList from '@/ui/CTAList'

export default function BlogPostList({
	intro,
	ctas,
	limit,
	currentPage,
	...props
}: Partial<{
	intro: any
	ctas: Sanity.CTA[]
	limit: number
	currentPage: Sanity.BlogPost | Sanity.Page
}> &
	Sanity.Module) {
	return (
		<>
			<BlogList
				{...props}
				intro={intro}
				limit={limit}
				layout="carousel"
				showFeaturedPostsFirst={false}
				currentPage={currentPage}
			/>
			<CTAList className="section justify-center" ctas={ctas} />
		</>
	)
}
