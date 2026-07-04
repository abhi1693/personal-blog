'use client'

import { useQueryState, parseAsInteger } from 'nuqs'

type PaginationProps = React.ComponentProps<'div'> &
	Partial<{
		buttonClassName: string
		prevClassName: string
		nextClassName: string
		prev: React.ReactNode
		next: React.ReactNode
		hidePage: boolean
		onClick: () => void
	}>

export function usePagination<T extends unknown>({
	items = [],
	itemsPerPage = 3,
}: {
	items: T[]
	itemsPerPage?: number
}) {
	'use no memo'

	const { page, setPage } = usePageState()

	const atStart = page === 1
	const atEnd = page === Math.ceil(items.length / itemsPerPage)

	const onPrev = () => setPage(Math.max(1, page - 1))
	const onNext = () =>
		setPage(Math.min(Math.ceil(items.length / itemsPerPage), page + 1))

	const paginatedItems = items.slice(
		itemsPerPage * (page - 1),
		itemsPerPage * page,
	)

	const currentPage = page
	const totalPages = Math.ceil(items.length / itemsPerPage)

	return {
		atStart,
		atEnd,
		onPrev,
		onNext,
		paginatedItems,
		currentPage,
		totalPages,
	}
}

export function PaginationControls({
	atStart,
	atEnd,
	currentPage,
	totalPages,
	hasItems,
	onPrev,
	onNext,
	buttonClassName,
	prevClassName,
	nextClassName,
	prev = 'Prev',
	next = 'Next',
	hidePage,
	// eslint-disable-next-line typescript/no-empty-function
	onClick = () => {},
	...props
}: PaginationProps & {
	atStart: boolean
	atEnd: boolean
	currentPage: number
	totalPages: number
	hasItems: boolean
	onPrev: () => void
	onNext: () => void
}) {
	if ((atStart && atEnd) || !hasItems) return null

	return (
		<nav className="flex items-center justify-center py-2" {...props}>
			<button
				className={`${
					prevClassName || buttonClassName
				} px-3 py-1 mx-1 text-sm font-medium border border-gray-300 rounded
            bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed`}
				onClick={() => {
					onPrev()
					onClick()
				}}
				disabled={atStart}
			>
				{prev}
			</button>

			{!hidePage && (
				<span className="mx-2 text-sm font-semibold text-gray-800">
					{currentPage} of {totalPages}
				</span>
			)}

			<button
				className={`${
					nextClassName || buttonClassName
				} px-3 py-1 mx-1 text-sm font-medium border border-gray-300 rounded
            bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed`}
				onClick={() => {
					onNext()
					onClick()
				}}
				disabled={atEnd}
			>
				{next}
			</button>
		</nav>
	)
}

export function usePageState() {
	'use no memo'

	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	return { page, setPage }
}
