import { BASE_URL, BLOG_DIR } from './env'
import { stegaClean } from 'next-sanity'

export default function resolveUrl(
	page?: Sanity.PageBase,
	{
		base = true,
		params,
	}: {
		base?: boolean
		params?: string
	} = {},
) {
	const segment = page?._type === 'blog.post' ? `/${BLOG_DIR}/` : '/'
	const slug = page?.metadata?.slug?.current
	const path = slug === 'index' ? null : slug

	return [
		base && BASE_URL,
		segment,
		path,
		stegaClean(params),
	]
		.filter(Boolean)
		.join('')
}
