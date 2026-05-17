import { client } from '@/sanity/lib/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder(client)

export function urlFor(image: Sanity.Image) {
	return builder.image(image)
}
