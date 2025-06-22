'use client'

import { SUBSCRIBER_STATUS_KEY, SUBSCRIBER_STATUS_SUBSCRIBED } from '@/lib/env'
import { useState } from 'react'

export default function SubscriberForm({
	onSuccess,
	showTitle = true,
}: {
	onSuccess?: () => void
	showTitle?: boolean
}) {
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setStatus('loading')
		setError(null)

		const form = e.currentTarget
		const formData = new FormData(form)

		const payload = {
			email: formData.get('email')?.toString() || '',
			firstName: formData.get('firstName')?.toString() || '',
		}

		try {
			const res = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			const data = await res.json()
			if (res.ok) {
				localStorage.setItem(
					SUBSCRIBER_STATUS_KEY,
					SUBSCRIBER_STATUS_SUBSCRIBED,
				)
				setStatus('success')
				form.reset()
				onSuccess?.()
			} else {
				setStatus('error')
				setError(data?.error || data?.message || 'Something went wrong.')
			}
		} catch {
			setStatus('error')
			setError('Something went wrong. Please try again.')
		}
	}

	if (status === 'success') {
		return (
			<div className="text-center py-4">
				<h2 className="text-base font-semibold">🎉 Subscribed!</h2>
				<p className="text-xs mt-2">Thank you for joining the list.</p>
			</div>
		)
	}

	return (
		<>
			{showTitle && (
				<>
					<h2 className="text-base font-semibold mb-1">
						Enjoying the content?
					</h2>
					<p className="text-xs mb-3 text-gray-600">Want more like this?</p>
				</>
			)}
			<form onSubmit={handleSubmit} className="space-y-2">
				<input
					name="firstName"
					type="text"
					placeholder="First name"
					className="w-full border px-3 py-1.5 text-sm rounded"
				/>
				<input
					name="email"
					type="email"
					required
					placeholder="Email address"
					className="w-full border px-3 py-1.5 text-sm rounded"
				/>
				<button
					type="submit"
					disabled={status === 'loading'}
					className="w-full bg-black text-white py-1.5 px-4 text-sm rounded flex items-center justify-center gap-2"
				>
					{status === 'loading' && (
						<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
					)}
					{status === 'loading' ? 'Subscribing...' : 'Subscribe'}
				</button>
				{status === 'error' && (
					<p className="text-xs text-red-500">
						{error || 'Something went wrong. Please try again.'}
					</p>
				)}
			</form>
		</>
	)
}
