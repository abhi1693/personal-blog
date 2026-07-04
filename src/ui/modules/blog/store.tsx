import { useQueryState } from 'nuqs'

export const useBlogFilters = () => {
	'use no memo'

	const [category, setCategory] = useQueryState('category', {
		defaultValue: 'All',
	})

	const [author, setAuthor] = useQueryState('author')

	return {
		category: category || 'All',
		author,
		setCategory,
		setAuthor,
	}
}
