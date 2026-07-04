import { fetchSanityLive } from './fetch'
import { BLOG_DIR } from '@/lib/env'
import errors from '@/lib/errors'
import { groq } from 'next-sanity'

export const LINK_QUERY = groq`
	...,
	internal->{
		_type,
		title,
		metadata
	}
`

export const IMAGE_QUERY = groq`
	...,
	'lqip': @.asset->metadata.lqip
`

const NAVIGATION_QUERY = groq`
	title,
	items[]{
		${LINK_QUERY},
		link{ ${LINK_QUERY} },
		links[]{ ${LINK_QUERY} },
		_type == 'megamenu' => {
			link{ ${LINK_QUERY} },
			items[]{
				...,
				_type == 'link' => { ${LINK_QUERY} },
				_type == 'link.list' => {
					link{ ${LINK_QUERY} },
					links[]{ ${LINK_QUERY} }
				},
				_type == 'link.card' => {
					link{ ${LINK_QUERY} },
					image{ ${IMAGE_QUERY} }
				}
			}
		}
	}
`

const ASSET_IMG_QUERY = groq`
	...,
	image { ${IMAGE_QUERY} }
`

export const CTA_QUERY = groq`
	...,
	link{ ${LINK_QUERY} }
`

export const REPUTATION_QUERY = groq`
	_type == 'reputation-block' => { reputation-> }
`

const SIDEBAR_QUERY = groq`
	...,
	modules[]{
		...,
		_type == 'callout' => {
			content[]{
				...,
				${REPUTATION_QUERY}
			},
			ctas[]{ ${CTA_QUERY} }
		}
	}
`

export const MODULES_QUERY = groq`
	...,
	ctas[]{
		...,
		link{ ${LINK_QUERY} }
	},
	sidebar{ ${SIDEBAR_QUERY} },
	_type == 'blog-list' => { filteredCategory-> },
	_type == 'breadcrumbs' => { crumbs[]{ ${LINK_QUERY} } },
	_type == 'callout' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		}
	},
	_type == 'card-list' => {
		cards[]{
			...,
			ctas[]{ ${CTA_QUERY} }
		}
	},
	_type == 'creative-module' => {
		modules[]{
			...,
			subModules[]{
				...,
				ctas[]{ ${CTA_QUERY} }
			}
		}
	},
	_type == 'form-module' => {
		form->
	},
	_type == 'hero' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		},
		assets[]{
			...,
			_type == 'img' => { ${ASSET_IMG_QUERY} }
		}
	},
	_type == 'hero.cover' => {
		image{
			${IMAGE_QUERY},
			mobile{ ${IMAGE_QUERY} }
		}
	},
	_type == 'hero.saas' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		},
		assets[]{
			...,
			_type == 'img' => { ${ASSET_IMG_QUERY} }
		}
	},
	_type == 'hero.split' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		},
		assets[]{
			...,
			_type == 'img' => { ${ASSET_IMG_QUERY} }
		}
	},
	_type == 'logo-list' => { logos[]-> },
	_type == 'person-list' => { people[]-> },
	_type == 'pricing-list' => {
		tiers[]->{
			...,
			ctas[]{ ${CTA_QUERY} }
		}
	},
	_type == 'prose' => {
		content[]{
			...,
			_type == 'image' => { ${IMAGE_QUERY} }
		},
		'headings': content[style in ['h2', 'h3', 'h4', 'h5', 'h6']]{
			style,
			'text': pt::text(@)
		}
	},
	_type == 'quote-list' => {
		quotes[]->{
			...,
			author{
				...,
				image{ ${IMAGE_QUERY} }
			}
		}
	},
	_type == 'richtext-module' => {
		content[]{
			...,
			_type == 'image' => { ${IMAGE_QUERY} }
		},
		'headings': content[style in ['h2', 'h3', 'h4', 'h5', 'h6']]{
			style,
			'text': pt::text(@)
		}
	},
	_type == 'tabbed-content' => {
		tabs[]{
			...,
			ctas[]{ ${CTA_QUERY} }
		}
	},
	_type == 'testimonial.featured' => { testimonial-> },
	_type == 'testimonial-list' => { testimonials[]-> },
`

export const GLOBAL_MODULE_PATH_QUERY = groq`
	string::startsWith($slug, path)
	&& select(
		defined(excludePaths) => count(excludePaths[string::startsWith($slug, @)]) == 0,
		true
	)
`

export const TRANSLATIONS_QUERY = groq`
	'translations': *[_type == 'translation.metadata' && references(^._id)].translations[].value->{
		'slug': metadata.slug.current,
		language
	}
`

export async function getSite() {
	const site = await fetchSanityLive<Sanity.Site>({
		query: groq`
			*[_type == 'site'][0]{
				...,
				ctas[]{ ${CTA_QUERY} },
				headerMenu->{ ${NAVIGATION_QUERY} },
				footerMenu->{ ${NAVIGATION_QUERY} },
				social->{ ${NAVIGATION_QUERY} },
				'ogimage': ogimage.asset->url
			}
		`,
	})

	if (!site) throw new Error(errors.missingSiteSettings)

	return site
}

export async function getTranslations() {
	return await fetchSanityLive<Sanity.Translation[]>({
		query: groq`*[_type in ['page', 'blog.post'] && defined(language)]{
			'slug': '/' + select(
				_type == 'blog.post' => '${BLOG_DIR}/' + metadata.slug.current,
				metadata.slug.current != 'index' => metadata.slug.current,
				''
			),
			'translations': *[_type == 'translation.metadata' && references(^._id)].translations[].value->{
				'slug': '/' + select(
					_type == 'blog.post' => '${BLOG_DIR}/' + language + '/' + metadata.slug.current,
					metadata.slug.current != 'index' => language + '/' + metadata.slug.current,
					language
				),
				_type == 'blog.post' => {
					'slugBlogAlt': '/' + language + '/${BLOG_DIR}/' + metadata.slug.current
				},
				language
			}
		}`,
	})
}

export async function getBooksByAuthors(authorIds: string[]) {
	if (!authorIds?.length) return [] as Sanity.Book[]
	return await fetchSanityLive<Sanity.Book[]>({
		query: groq`*[_type == 'book' && active == true && count(authors[@._ref in $authorIds]) > 0]{
			_type,
			_id,
			title,
			defaultLink,
			countryLinks,
			image { ${IMAGE_QUERY} },
			authors[]->
		}`,
		params: { authorIds },
	})
}
