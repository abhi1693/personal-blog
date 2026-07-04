'use client'

import PostPreview from '../PostPreview'
import { useBlogFilters } from '../store'

export default function List({
	posts,
	...props
}: {
	posts: Sanity.BlogPost[]
} & React.ComponentProps<'ul'>) {
	return (
		<ul {...props}>
			{posts.length ? (
				posts.map((post) => (
					<li className="anim-fade" key={post._id}>
						<PostPreview post={post} />
					</li>
				))
			) : (
				<li className="text-ink/60 col-span-full">No posts found...</li>
			)}
		</ul>
	)
}

export function FilteredList({
	posts,
	...props
}: {
	posts: Sanity.BlogPost[]
} & React.ComponentProps<'ul'>) {
	const filters = useBlogFilters()

	return <List posts={filterPosts(posts, filters)} {...props} />
}

export function PostListItems({ posts }: { posts: Sanity.BlogPost[] }) {
	return (
		<>
			{posts.map((post) => (
				<li className="anim-fade" key={post._id}>
					<PostPreview post={post} />
				</li>
			))}
		</>
	)
}

export function filterPosts(
	posts: Sanity.BlogPost[],
	{
		category,
		author,
	}: {
		category: string
		author: string | null
	},
) {
	return posts.filter((post) => {
		if (category !== 'All' && author)
			return (
				post.authors?.some(({ slug }) => slug?.current === author) &&
				post.categories?.some(({ slug }) => slug?.current === category)
			)

		if (category !== 'All')
			return post.categories?.some(({ slug }) => slug?.current === category)

		if (author)
			return post.authors?.some(({ slug }) => slug?.current === author)

		return true
	})
}
