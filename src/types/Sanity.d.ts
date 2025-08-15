import type { SanityAssetDocument, SanityDocument } from 'next-sanity'

declare global {
	namespace Sanity {
		// documents

		interface Site extends SanityDocument {
			// branding
			title: string
			blurb?: any
			logo?: Logo
			// info
			announcements?: Announcement[]
			copyright?: any
			ogimage?: string
			// navigation
			ctas?: CTA[]
			headerMenu?: Navigation
			footerMenu?: Navigation
			social?: Navigation
		}

		interface Navigation extends SanityDocument {
			title: string
			items?: (Link | LinkList)[]
		}

		// pages

		interface PageBase extends SanityDocument {
			title?: string
			metadata: Metadata
			readonly language?: string
		}

		interface Page extends PageBase {
			readonly _type: 'page'
			modules?: Module[]
		}

		interface Translation {
			slug: string
			translations?: {
				slug: string
				slugBlogAlt?: string
				language: string
			}[]
		}

		interface GlobalModule extends SanityDocument {
			path: string
			excludePaths?: string[]
			modules?: Module[]
		}

		interface YouTubeEmbed {
			videoId: string
			title: string
		}

		interface BlogPost extends PageBase {
			readonly _type: 'blog.post'
			body: any
			categories: BlogCategory[]
			authors: Person[]
			youTubeEmbed?: YouTubeEmbed
			featured: boolean
			publishDate: string
			faq?: AccordionList
		}

		interface BlogCategory extends SanityDocument {
			title: string
			slug: { current: string }
		}

		// miscellaneous

		interface Announcement extends SanityDocument {
			content: any
			cta?: Link
			start?: string
			end?: string
		}

		interface Logo extends SanityDocument {
			name: string
			image?: Partial<{
				default: Image
				light: Image
				dark: Image
			}>
		}

		interface Person extends SanityDocument {
			name: string
			slug?: { current: string }
			image?: Image
			// profile
			title?: string
			tagline?: string
			location?: string
			company?: string
			socials?: Link[]
			// content
			bio?: any
			coverImage?: Image
			featuredPosts?: BlogPost[]
			featuredBooks?: Book[]
			// seo
		}

		interface Book extends SanityDocument {
			title: string
			defaultLink: string
			countryLinks?: {
				country: string // ISO 3166-1 alpha-2
				link: string
			}[]
			image?: Image
			authors: Person[]
			active?: boolean
		}

		interface Pricing extends SanityDocument {
			title: string
			highlight?: string
			price: {
				base?: number
				strikethrough?: number
				suffix?: string
			}
			ctas?: CTA[]
			content?: any
		}

		interface Reputation extends SanityDocument {
			title?: string
			subtitle?: string
			repo?: string
			showForks?: boolean
			limit?: number
			avatars?: Image[]
		}

		interface Testimonial extends SanityDocument {
			content: any
			source?: string
			author?: {
				name: string
				title?: string
				image?: Image
			}
		}

		// objects

		interface Code {
			readonly _type: 'code'
			language: string
			code: string
			filename?: string
			highlightedLines?: number[]
		}

		interface CTA {
			readonly _type?: 'cta'
			_key?: string
			link?: Link
			style?: string
		}

		interface CustomHTML extends Module<'custom-html'> {
			className?: string
			html?: {
				code: string
			}
		}

		interface Icon {
			readonly _type: 'icon'
			image?: Image
			ic0n?: string
			size?: string
		}

		interface Img {
			readonly _type: 'img'
			image: Image
			responsive?: {
				image: Image
				media: string
			}[]
			alt?: string
			loading?: 'lazy' | 'eager'
		}

		interface Image extends SanityAssetDocument {
			alt: string
			loading: 'lazy' | 'eager'
		}

		interface Link {
			readonly _type: 'link'
			label: string
			type: 'internal' | 'external'
			internal?: Page | BlogPost
			external?: string
			params?: string
		}

		interface LinkList {
			readonly _type: 'link.list'
			link?: Link
			links?: Link[]
		}

		interface Metadata {
			slug: { current: string }
			title: string
			description: string
			image?: Image
			ogimage?: string
			noIndex: boolean
		}

		interface AccordionList extends Module<'accordion-list'> {
			pretitle?: string
			intro?: any
			items: AccordionItem[]
			layout?: 'vertical' | 'horizontal'
			connect?: boolean
			generateSchema?: boolean
		}

		interface AccordionItem {
			summary: string
			content: any
			open?: boolean
		}

		interface Module<T = string> {
			_type: T
			_key: string
			options?: {
				hidden?: boolean
				uid?: string
			}
		}
	}
}

export {}
