import { GoPerson } from 'react-icons/go'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'person',
	title: 'Person',
	type: 'document',
	icon: GoPerson,
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'name',
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Avatar',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),

		// Profile
		defineField({ name: 'title', title: 'Title/Role', type: 'string' }),
		defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
		defineField({ name: 'location', title: 'Location', type: 'string' }),
		defineField({ name: 'company', title: 'Company', type: 'string' }),
		defineField({
			name: 'socials',
			title: 'Social Links',
			type: 'array',
			of: [defineArrayMember({ type: 'link' })],
			options: { sortable: true },
		}),

		// Content
		defineField({
			name: 'bio',
			title: 'Bio',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'coverImage',
			title: 'Cover Image',
			type: 'image',
			options: { hotspot: true },
		}),
		defineField({
			name: 'featuredPosts',
			title: 'Featured Posts',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'reference',
					to: [{ type: 'blog.post' }],
				}),
			],
			validation: (Rule) => Rule.max(6),
		}),
		defineField({
			name: 'featuredBooks',
			title: 'Featured Books',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'reference',
					to: [{ type: 'book' }],
				}),
			],
			validation: (Rule) => Rule.max(6),
		}),

		// SEO
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'title',
			media: 'image',
		},
	},
})
