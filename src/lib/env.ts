export const dev = process.env.NODE_ENV === 'development'
export const vercelPreview = process.env.VERCEL_ENV === 'preview'

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const BLOG_DIR = 'posts'
