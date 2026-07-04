import AccordionList from './AccordionList'
import Breadcrumbs from './Breadcrumbs'
import Callout from './Callout'
import CardList from './CardList'
import CustomHTML from './CustomHTML'
import FlagList from './FlagList'
import Hero from './Hero'
import HeroCover from './HeroCover'
import HeroSaaS from './HeroSaaS'
import HeroSplit from './HeroSplit'
import LogoList from './LogoList'
import FormModule from './FormModule'
import QuoteList from './QuoteList'
import RichtextModule from './RichtextModule'
import ScheduleModule from './ScheduleModule'
import SearchModule from './SearchModule'
import StatList from './StatList'
import StepList from './StepList'
import TabbedContent from './TabbedContent'
import TestimonialFeatured from './TestimonialFeatured'
import TestimonialList from './TestimonialList'
import BlogFrontpage from './blog/BlogFrontpage'
import BlogIndex from './blog/BlogIndex'
import BlogList from './blog/BlogList'
import BlogPostContent from './blog/PostContent'
import BlogPostList from './blog/BlogPostList'
import { createDataAttribute } from 'next-sanity'
import dynamic from 'next/dynamic'

const MODULE_MAP = {
	'accordion-list': AccordionList,
	'blog-frontpage': BlogFrontpage,
	'blog-index': BlogIndex,
	'blog-list': BlogList,
	'blog-post-content': BlogPostContent,
	'blog-post-list': BlogPostList,
	breadcrumbs: Breadcrumbs,
	callout: Callout,
	'card-list': CardList,
	'creative-module': dynamic(() => import('./CreativeModule')),
	'custom-html': CustomHTML,
	'flag-list': FlagList,
	'form-module': FormModule,
	hero: Hero,
	'hero.cover': HeroCover,
	'hero.split': HeroSplit,
	'hero.saas': HeroSaaS,
	'logo-list': LogoList,
	'person-list': dynamic(() => import('./PersonList')),
	'pricing-list': dynamic(() => import('./PricingList')),
	prose: RichtextModule,
	'quote-list': QuoteList,
	'richtext-module': RichtextModule,
	'schedule-module': ScheduleModule,
	'search-module': SearchModule,
	'stat-list': StatList,
	'step-list': StepList,
	'tabbed-content': TabbedContent,
	'testimonial-list': TestimonialList,
	'testimonial.featured': TestimonialFeatured,
} as const

export default function Modules({
	modules,
	page,
	post,
}: {
	modules?: Sanity.Module[]
	page?: Sanity.Page
	post?: Sanity.BlogPost
}) {
	const getAdditionalProps = (module: Sanity.Module) => {
		switch (module._type) {
			case 'blog-post-content':
				return { post }
			case 'blog-frontpage':
			case 'blog-index':
			case 'blog-list':
			case 'blog-post-list':
			case 'breadcrumbs':
				return { currentPage: post || page }
			default:
				return {}
		}
	}

	return (
		<>
			{modules?.map((module) => {
				if (!module) return null

				const Component = MODULE_MAP[module._type as keyof typeof MODULE_MAP]

				if (!Component) return null

				return (
					<Component
						{...module}
						{...getAdditionalProps(module)}
						data-sanity={
							!!page?._id &&
							createDataAttribute({
								id: page._id,
								type: page?._type,
								path: `page[_key == "${module._key}"]`,
							}).toString()
						}
						key={module._key}
					/>
				)
			})}
		</>
	)
}
