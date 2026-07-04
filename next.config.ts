import { BLOG_DIR } from '@/lib/env'
import { supportedLanguages } from '@/lib/i18n'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import type { NextConfig } from 'next'
import { createClient, groq } from 'next-sanity'

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
})

export default {
	reactCompiler: true,
	allowedDevOrigins: ['192.168.1.101'],
	output: 'standalone',
	compiler: {
		styledComponents: true,
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		webpackMemoryOptimizations: true,
	},
	productionBrowserSourceMaps: true,
	images: {
		dangerouslyAllowSVG: true,
		localPatterns: [{ pathname: '/api/og' }],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
	},

	async redirects() {
		return await client.fetch(groq`*[_type == 'redirect']{
			source,
			'destination': select(
				destination.type == 'internal' =>
					select(
						destination.internal->._type == 'blog.post' => '/${BLOG_DIR}/',
						'/'
					) + destination.internal->.metadata.slug.current,
				destination.external
			),
			permanent
		}`)
	},

	async rewrites() {
		const rewrites = [
			{ source: '/:slug.md', destination: '/api/md/:slug' },
			{ source: '/:path*/:slug.md', destination: '/api/md/:path*/:slug' },
		]

		if (!supportedLanguages?.length) return rewrites

		return [
			...rewrites,
			{
				source: `/:lang/${BLOG_DIR}/:slug`,
				destination: `/${BLOG_DIR}/:lang/:slug`,
			},
		]
	},

	env: {
		SC_DISABLE_SPEEDY: 'false',
	},
} satisfies NextConfig
