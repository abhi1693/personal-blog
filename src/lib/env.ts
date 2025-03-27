import { baseUrl } from './utils'

export const dev = process.env.NODE_ENV === 'development'
export const vercelPreview = process.env.VERCEL_ENV === 'preview'

export const BASE_URL = baseUrl()

export const BLOG_DIR = 'posts'
