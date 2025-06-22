'use client'

import { useEffect } from 'react'
import SubscriberForm from '@/ui/SubscriberForm'

export default function NewsletterModal({
	isOpen,
	onCloseAction,
}: {
	isOpen: boolean
	onCloseAction: () => void
}) {
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'auto'
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
			<div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 shadow-2xl animate-fade-in">
				<button
					onClick={onCloseAction}
					aria-label="Close modal"
					className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-light"
				>
					×
				</button>

				<div className="text-center mb-4">
					<h2 className="text-lg font-semibold">Don&#39;t Miss Out</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						Subscribe to get new posts directly in your inbox.
					</p>
				</div>

				<SubscriberForm showTitle={false} onSuccess={onCloseAction} />
			</div>
		</div>
	)
}
