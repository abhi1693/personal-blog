import blogCategory from './documents/blog.category'
import blogPost from './documents/blog.post'
import book from './documents/book'
import form from './documents/form'
import globalModule from './documents/global-module'
import navigation from './documents/navigation'
import page from './documents/page'
import quote from './documents/quote'
import redirect from './documents/redirect'
import site from './documents/site'
import skill from './documents/skill'
// miscellaneous
import announcement from './misc/announcement'
import logo from './misc/logo'
import person from './misc/person'
import pricing from './misc/pricing'
import reputation from './misc/reputation'
import testimonial from './misc/testimonial'
// modules
import accordionList from './modules/accordion-list'
import blogFrontpage from './modules/blog-frontpage'
import blogIndex from './modules/blog-index'
import blogList from './modules/blog-list'
import blogPostContent from './modules/blog-post-content'
import blogPostList from './modules/blog-post-list'
import breadcrumbs from './modules/breadcrumbs'
import callout from './modules/callout'
import cardList from './modules/card-list'
import creativeModule from './modules/creative'
import customHtml from './modules/custom-html'
import flagList from './modules/flag-list'
import formModule from './modules/form-module'
import hero from './modules/hero'
import heroCover from './modules/hero.cover'
import heroSaas from './modules/hero.saas'
import heroSplit from './modules/hero.split'
import logoList from './modules/logo-list'
import personList from './modules/person-list'
import pricingList from './modules/pricing-list'
import prose from './modules/prose'
import quoteList from './modules/quote-list'
import richtextModule from './modules/richtext-module'
import scheduleModule from './modules/schedule-module'
import searchModule from './modules/search-module'
import statList from './modules/stat-list'
import stepList from './modules/step-list'
import tabbedContent from './modules/tabbed-content'
import testimonialList from './modules/testimonial-list'
import testimonialFeatured from './modules/testimonial.featured'
// objects
import cta from './objects/cta'
import icon from './objects/icon'
import img from './objects/img'
import link from './objects/link'
import linkList from './objects/link.list'
import megamenu from './objects/megamenu'
import metadata from './objects/metadata'
import moduleAttributes from './objects/module-attributes'
import sidebar from './objects/sidebar'
import type { SchemaPluginOptions } from 'sanity'

export const schema: SchemaPluginOptions = {
	types: [
		// documents
		site,
		page,
		globalModule,
		blogPost,
		book,
		form,
		skill,
		quote,
		blogCategory,
		navigation,

		// miscellaneous
		announcement,
		redirect,
		logo,
		person,
		pricing,
		reputation,
		testimonial,

		// objects
		cta,
		icon,
		img,
		link,
		linkList,
		megamenu,
		metadata,
		moduleAttributes,
		sidebar,

		// modules
		accordionList,
		blogFrontpage,
		blogIndex,
		blogList,
		blogPostContent,
		blogPostList,
		breadcrumbs,
		callout,
		cardList,
		creativeModule,
		customHtml,
		flagList,
		formModule,
		hero,
		heroCover,
		heroSaas,
		heroSplit,
		logoList,
		personList,
		pricingList,
		prose,
		quoteList,
		richtextModule,
		scheduleModule,
		searchModule,
		statList,
		stepList,
		tabbedContent,
		testimonialFeatured,
		testimonialList,
	],

	templates: (templates) =>
		templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
}

const singletonTypes = ['site']
