import { getBlogFeed } from '@/lib/blog-feed-data'

export async function GET() {
	return getBlogFeed('atom')
}
