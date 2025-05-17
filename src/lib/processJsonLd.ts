import { urlFor } from '@/sanity/lib/image'

export function articleJsonLd(post: Sanity.BlogPost) {
	const authors = post.authors.map((author) => {
		const image = author.image ? urlFor(author.image).url() : undefined
		return {
			'@type': 'Person',
			name: author.name,
			...(image && { image }),
		}
	})

	const postImage = post.metadata.image
	const imageUrl = postImage ? urlFor(postImage).url() : undefined

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		author: authors,
		dateModified: post.publishDate,
		datePublished: post.publishDate,
		headline: post.metadata.title,
		...(imageUrl && { image: imageUrl }),
	}
}
