import { BASE_URL, BLOG_DIR } from './env'
import { DEFAULT_LANG } from './i18n'
import { stegaClean } from 'next-sanity'

export default function resolveUrl(
	page?: Sanity.PageBase | Sanity.BlogCategory,
	{
		base = true,
		params,
		language,
	}: {
		base?: boolean
		params?: string
		language?: string
	} = {},
) {
	const isCategory = page?._type === 'blog.category' && 'slug' in page
	const segment =
		page?._type === 'blog.post'
			? `/${BLOG_DIR}/`
			: isCategory
				? `/${BLOG_DIR}/category/`
				: '/'
	const lang = language && language !== DEFAULT_LANG ? `/${language}` : ''
	const slug = isCategory
		? page.slug.current
		: page && 'metadata' in page
			? page.metadata?.slug?.current
			: undefined
	const path = slug === 'index' ? null : slug

	return [base && BASE_URL, lang, segment, path, stegaClean(params)]
		.filter(Boolean)
		.join('')
}
