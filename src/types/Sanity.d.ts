import type * as Generated from '@/sanity/types'
import type { SanityImageSource } from '@sanity/image-url/src/types'

type ImageValue = SanityImageSource & {
	_type?: 'image'
	asset?: Generated.SanityImageAssetReference | Generated.SanityImageAsset
	media?: unknown
	hotspot?: Generated.SanityImageHotspot
	crop?: Generated.SanityImageCrop
	alt?: string
	loading?: 'lazy' | 'eager'
	lqip?: string
}

type ModuleBase<T extends string = string> = {
	_type: T
	_key: string
	attributes?: Generated.ModuleAttributes
}

declare global {
	namespace Sanity {
		type Image = ImageValue
		type Code = Omit<Generated.Code, 'language' | 'code'> & {
			language: string
			code: string
		}
		type Metadata = Omit<Generated.Metadata, 'slug' | 'image'> & {
			slug: { current: string }
			title: string
			description: string
			image?: Image
			ogimage?: string
			noIndex: boolean
		}

		type Link = Omit<Generated.Link, 'label' | 'type' | 'internal'> & {
			_key?: string
			label: string
			type: 'internal' | 'external'
			internal?: Page | BlogPost | BlogCategory
		}
		type LinkList = Omit<Generated.LinkList, 'link' | 'links'> & {
			_key?: string
			link?: Link
			links?: Link[]
		}
		type LinkCard = {
			_type: 'link.card'
			_key: string
			image?: Image
			link?: Link
			content?: any
		}
		type Megamenu = Omit<Generated.Megamenu, 'link' | 'items'> & {
			_key?: string
			link?: Link
			items?: (Link | LinkList | LinkCard)[]
		}
		type SidebarTableOfContents = {
			_type: 'tableOfContents'
			_key: string
			summary?: string
			maxHeadingDepth?: number
		}
		type Sidebar = Omit<Generated.Sidebar, 'modules'> & {
			modules?: (Callout | CustomHTML | SidebarTableOfContents)[]
		}
		type CTA = Omit<Generated.Cta, '_type' | 'link'> & {
			_type?: 'cta'
			_key?: string
			link?: Link
		}
		type CustomHTML = Omit<Generated.CustomHtml, 'html' | 'css'> &
			ModuleBase<'custom-html'> & {
				className?: string
				html?: { code: string }
				css?: { code: string }
			}
		type Icon = Omit<Generated.Icon, 'image'> & { image?: Image }
		type Img = Omit<Generated.Img, 'image' | 'responsive'> & {
			image: Image
			responsive?: { image: Image; media: string }[]
		}

		type Module<T extends string = string> = ModuleBase<T>

		type AccordionItem = {
			summary: string
			content: any
			open?: boolean
		}
		type AccordionList = Omit<Generated.AccordionList, 'items'> &
			ModuleBase<'accordion-list'> & {
				items: AccordionItem[]
			}
		type Callout = Omit<Generated.Callout, 'ctas'> &
			ModuleBase<'callout'> & {
				ctas?: CTA[]
			}

		type Navigation = Omit<Generated.Navigation, 'title' | 'items'> & {
			title: string
			items?: (Link | LinkList | Megamenu)[]
		}
		type Announcement = Omit<Generated.Announcement, 'cta'> & {
			cta?: Link
		}
		type Logo = Omit<Generated.Logo, 'image'> & {
			image?: Partial<{
				default: Image
				light: Image
				dark: Image
			}>
		}
		type BlogCategory = Omit<Generated.BlogCategory, 'title' | 'slug'> & {
			title: string
			slug: { current: string }
		}
		type Person = Omit<
			Generated.Person,
			'image' | 'coverImage' | 'socials' | 'featuredPosts' | 'featuredBooks'
		> & {
			image?: Image
			coverImage?: Image
			socials?: Link[]
			featuredPosts?: BlogPost[]
			featuredBooks?: Book[]
		}
		type Book = Omit<Generated.Book, 'image' | 'authors'> & {
			image?: Image
			authors: Person[]
		}
		type Pricing = Omit<Generated.Pricing, 'ctas'> & {
			ctas?: CTA[]
		}
		type Reputation = Omit<Generated.Reputation, 'avatars'> & {
			avatars?: Image[]
		}
		type Testimonial = Omit<Generated.Testimonial, 'author'> & {
			author?: {
				name: string
				title?: string
				image?: Image
			}
		}

		type Site = Omit<
			Generated.Site,
			'logo' | 'announcements' | 'ctas' | 'headerMenu' | 'footerMenu' | 'social'
		> & {
			title: string
			logo?: Logo
			announcements?: Announcement[]
			ctas?: CTA[]
			headerMenu?: Navigation
			footerMenu?: Navigation
			social?: Navigation
			ogimage?: string
		}

		type PageBase = {
			_id: string
			_type: string
			title?: string
			metadata: Metadata
			readonly language?: string
			categories?: BlogCategory[]
		}
		type Page = Omit<Generated.Page, 'metadata' | 'modules' | 'title'> &
			PageBase & {
				readonly _type: 'page'
				modules?: Module[]
			}
		type BlogPost = Omit<
			Generated.BlogPost,
			'metadata' | 'categories' | 'authors' | 'faq' | 'title' | 'body'
		> &
			PageBase & {
				readonly _type: 'blog.post'
				body: any
				categories: BlogCategory[]
				authors: Person[]
				publishDate: string
				youTubeEmbed?: {
					videoId: string
					title: string
				}
				youtubeEmbed: {
					videoID: string
				}
				faq?: AccordionList
			}
		type GlobalModule = Omit<
			Generated.GlobalModule,
			'path' | 'excludePaths' | 'before' | 'after'
		> & {
			path: string
			excludePaths?: string[]
			modules?: Module[]
			before?: Module[]
			after?: Module[]
		}
		type Translation = {
			slug: string
			translations?: {
				slug: string
				slugBlogAlt?: string
				language: string
			}[]
		}
	}
}

export {}
