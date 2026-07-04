'use client'

import List, { filterPosts } from '../BlogList/List'
import { useBlogFilters } from '../store'
import { PaginationControls, usePagination } from '@/lib/usePagination'

export default function Paginated({
	posts,
	itemsPerPage = 6,
}: {
	posts: Sanity.BlogPost[]
	itemsPerPage?: number
}) {
	const filters = useBlogFilters()
	const filteredPosts = filterPosts(posts, filters)
	const pagination = usePagination({
		items: filteredPosts,
		itemsPerPage,
	})
	const {
		paginatedItems,
		atStart,
		atEnd,
		currentPage,
		totalPages,
		onPrev,
		onNext,
	} = pagination

	function scrollToList() {
		if (typeof window !== 'undefined')
			document
				.querySelector('#posts-list')
				?.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div className="relative space-y-12">
			<List
				id="posts-list"
				posts={paginatedItems}
				className="grid scroll-mt-[calc(var(--header-height)+1rem)] gap-x-8 gap-y-12 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
			/>

			<PaginationControls
				atStart={atStart}
				atEnd={atEnd}
				currentPage={currentPage}
				totalPages={totalPages}
				onPrev={onPrev}
				onNext={onNext}
				hasItems={!!filteredPosts.length}
				className="frosted-glass bg-canvas sticky bottom-0 flex items-center justify-center gap-4 p-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] tabular-nums"
				buttonClassName="hover:underline disabled:opacity-20"
				onClick={scrollToList}
			/>
		</div>
	)
}
