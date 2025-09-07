import { BLOG_DIR } from '@/lib/env'
import errors from '@/lib/errors'
import { languages } from '@/lib/i18n'
import processMetadata from '@/lib/processMetadata'
import resolveUrl from '@/lib/resolveUrl'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import {
	MODULES_QUERY,
	GLOBAL_MODULE_PATH_QUERY,
	TRANSLATIONS_QUERY,
} from '@/sanity/lib/queries'
import Modules from '@/ui/modules'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'

export const revalidate = 86400

export default async function Page({ params }: Props) {
	const page = await getPage(await params)
	if (!page) notFound()
	return <Modules modules={page.modules} page={page} />
}

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<Params>
	searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
	const [resolvedParams, sp] = await Promise.all([params, searchParams])
	const page = await getPage(resolvedParams)
	if (!page) notFound()

	const meta = await processMetadata(page)

	const hasFacetParams =
		!!sp &&
		(sp.category !== undefined ||
			sp.tag !== undefined ||
			sp.page !== undefined ||
			sp.sort !== undefined)

	if (hasFacetParams) {
		const categoryParam = Array.isArray(sp.category)
			? sp.category[0]
			: sp.category
		const canonical =
			categoryParam && categoryParam !== 'All'
				? `/${BLOG_DIR}/category/${categoryParam}`
				: resolveUrl(page)
		return {
			...meta,
			robots: { index: false, follow: true },
			alternates: {
				...(meta.alternates || {}),
				canonical,
			},
		}
	}

	return meta
}

export async function generateStaticParams() {
	const slugs = await client.fetch<{ slug: string }[]>(
		groq`*[
			_type == 'page'
			&& defined(metadata.slug.current)
			&& !(metadata.slug.current in ['index'])
		]{
			'slug': metadata.slug.current
		}`,
	)

	return slugs.map(({ slug }) => ({ slug: slug.split('/') }))
}

async function getPage(params: Params) {
	const { slug, lang } = processSlug(params)

	const page = await fetchSanityLive<Sanity.Page>({
		query: groq`*[
			_type == 'page'
			&& metadata.slug.current == $slug
			${lang ? `&& language == '${lang}'` : ''}
		][0]{
			...,
			'modules': (
				// global modules (before)
				*[_type == 'global-module' && path == '*'].before[]{ ${MODULES_QUERY} }
				// path modules (before)
				+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY}].before[]{ ${MODULES_QUERY} }
				// page modules
				+ modules[]{ ${MODULES_QUERY} }
				// path modules (after)
				+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY}].after[]{ ${MODULES_QUERY} }
				// global modules (after)
				+ *[_type == 'global-module' && path == '*'].after[]{ ${MODULES_QUERY} }
			),
			metadata {
				...,
				'ogimage': image.asset->url + '?w=1200'
			},
			${TRANSLATIONS_QUERY},
		}`,
		params: { slug },
	})

	if (slug === 'index' && !page) throw new Error(errors.missingHomepage)

	return page
}

type Params = { slug?: string[] }

type Props = {
	params: Promise<Params>
}

function processSlug(params: Params) {
	const lang =
		params.slug && languages.includes(params.slug[0])
			? params.slug[0]
			: undefined

	if (params.slug === undefined)
		return {
			slug: 'index',
			lang,
		}

	const slug = params.slug.join('/')

	if (lang) {
		const processed = slug.replace(new RegExp(`^${lang}/?`), '')

		return {
			slug: processed === '' ? 'index' : processed,
			lang,
		}
	}

	return { slug }
}
