import { BASE_URL, BLOG_DIR } from './env'
import { DEFAULT_LANG } from './i18n'
import { stegaClean } from 'next-sanity'

export default function resolveUrl(
	page?: Sanity.PageBase,
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
	const lang = language && language !== DEFAULT_LANG ? `/${language}` : ''
	const slug = page?.metadata?.slug?.current || page?.slug?.current

	let segment = '/'
	let path: null | string | undefined = null

	if (page?._type === 'blog.post') {
		segment = `/${BLOG_DIR}/`
		path = slug === 'index' ? null : slug
	} else if (page?._type === 'blog.category') {
		// Render as query param route for category
		segment = '/'
		path = `?category=${slug}`
	} else {
		path = slug === 'index' ? null : slug
	}

	return [base && BASE_URL, lang, segment, path, stegaClean(params)]
		.filter(Boolean)
		.join('')
}
