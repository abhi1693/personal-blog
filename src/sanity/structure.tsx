import { pageDirectoriesListItem } from './lib/page-directories'
import { VscFiles, VscServerProcess } from 'react-icons/vsc'
import { structureTool } from 'sanity/structure'
import type { StructureResolver } from 'sanity/structure'
import { singleton, group } from 'sanitypress-utils'

const structureResolver: StructureResolver = (S, context) =>
	S.list()
		.title('Content')
		.items([
			singleton(S, 'site', 'Site settings').icon(VscServerProcess),
			S.divider(),

			S.documentTypeListItem('page').title('All pages').icon(VscFiles),
			pageDirectoriesListItem(S, context).icon(VscFiles),

			S.documentTypeListItem('global-module').title('Global modules'),
			S.divider(),

			S.documentTypeListItem('blog.post').title('Blog posts'),
			S.documentTypeListItem('blog.category').title('Blog categories'),
			S.documentTypeListItem('book').title('Books'),
			S.divider(),

			S.documentTypeListItem('navigation'),
			S.documentTypeListItem('redirect').title('Redirects'),

			group(S, 'Miscellaneous', [
				S.documentTypeListItem('announcement').title('Announcements'),
				S.documentTypeListItem('logo').title('Logos'),
				S.documentTypeListItem('person').title('People'),
				S.documentTypeListItem('pricing').title('Pricing tiers'),
				S.documentTypeListItem('reputation'),
				S.documentTypeListItem('testimonial').title('Testimonials'),
			]),
		])

export const structure = structureTool({
	structure: structureResolver,
})
