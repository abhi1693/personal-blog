export const dev = process.env.NODE_ENV === 'development'

export const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const BLOG_DIR = 'posts'

export const SUBSCRIBER_STATUS_KEY = 'subscriberStatus'
export const SUBSCRIBER_STATUS_SUBSCRIBED = 'subscribed'
