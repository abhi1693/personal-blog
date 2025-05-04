'use client'

import { useEffect, useState } from 'react'
import {
	FaXTwitter,
	FaFacebook,
	FaLinkedin,
	FaReddit,
	FaLink,
} from 'react-icons/fa6'

const platforms = [
	{
		name: 'X',
		Icon: FaXTwitter,
		href: (url: string, title: string) =>
			`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
	},
	{
		name: 'Facebook',
		Icon: FaFacebook,
		href: (url: string) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
	},
	{
		name: 'LinkedIn',
		Icon: FaLinkedin,
		href: (url: string, title: string) =>
			`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
	},
	{
		name: 'Reddit',
		Icon: FaReddit,
		href: (url: string, title: string) =>
			`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
	},
]

export default function ShareButtons({
	url,
	title,
}: {
	url: string
	title: string
}) {
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (copied) {
			const timer = setTimeout(() => setCopied(false), 1500)
			return () => clearTimeout(timer)
		}
	}, [copied])

	const handleCopy = async () => {
		if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(url)
				setCopied(true)
			} catch (err) {
				console.error('Copy failed:', err)
			}
		} else {
			console.warn('Clipboard API not available')
		}
	}

	return (
		<div className="mt-6 border-t pt-4 text-sm">
			<p className="mb-2 font-semibold">Share this post</p>
			<div className="flex flex-wrap items-center gap-5 text-xl text-blue-600">
				{platforms.map(({ name, Icon, href }) => (
					<a
						key={name}
						href={href(url, title)}
						target="_blank"
						rel="noopener noreferrer"
						title={`Share on ${name}`}
						className="hover:text-blue-800 transition-colors"
					>
						<Icon />
					</a>
				))}

				<button
					onClick={handleCopy}
					title="Copy link"
					className="hover:text-blue-800 transition-colors"
				>
					{copied ? (
						<span className="text-base text-green-600">✔</span>
					) : (
						<FaLink />
					)}
				</button>
			</div>
		</div>
	)
}
