'use server'

import { dev } from '@/lib/env'
import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { defineLive } from 'next-sanity/live'
import { draftMode } from 'next/headers'

export const { sanityFetch, SanityLive } = defineLive({
	client,
	serverToken: token,
	browserToken: token,
})

export async function fetchSanityLive<T = any>(
	args: Parameters<typeof sanityFetch>[0],
) {
	const preview = dev || (await draftMode()).isEnabled

	const { data } = await sanityFetch({
		...args,
		perspective: preview ? 'drafts' : 'published',
	})

	return data as T
}
