'use client'

import { useState } from 'react'
import { useSubscribeNewsletter } from '@/ui/hooks/useSubscribeNewsletter'

export default function SubscriberForm({
	onSuccess,
	showTitle = true,
}: {
	onSuccess?: () => void
	showTitle?: boolean
}) {
	const { status, error, submit } = useSubscribeNewsletter(onSuccess)
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const res = await submit({ email, firstName })
		if (res.ok) {
			setEmail('')
			setFirstName('')
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
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<input
					name="email"
					type="email"
					required
					placeholder="Email address"
					className="w-full border px-3 py-1.5 text-sm rounded"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
				{status === 'already' && (
					<p className="text-xs text-green-600">You&#39;re already subscribed.</p>
				)}
			</form>
		</>
	)
}
