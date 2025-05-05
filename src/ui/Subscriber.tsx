'use client'

import { useEffect, useState } from 'react'

export default function Subscriber() {
	const [show, setShow] = useState(false)
	const [dismissed, setDismissed] = useState(false)
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const isDismissed = sessionStorage.getItem('subscriberDismissed') === 'true'
		const isSubscribed =
			localStorage.getItem('subscriberStatus') === 'subscribed'

		if (isDismissed || isSubscribed) {
			setDismissed(true)
			return
		}

		const onScroll = () => {
			const scroll = (window.scrollY / document.body.scrollHeight) * 100
			if (scroll > 60) {
				setShow(true)
				window.removeEventListener('scroll', onScroll)
			}
		}

		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const dismiss = () => {
		sessionStorage.setItem('subscriberDismissed', 'true')
		setShow(false)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.currentTarget
		const formData = new FormData(form)

		const email = formData.get('email')?.toString() || ''
		const firstName = formData.get('firstName')?.toString() || ''
		const lastName = formData.get('lastName')?.toString() || ''

		try {
			const res = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, firstName, lastName }),
			})

			if (res.ok) {
				localStorage.setItem('subscriberStatus', 'subscribed')
				setStatus('success')
				form.reset()
				setTimeout(() => dismiss(), 1500)
			} else {
				setStatus('error')
				const data = await res.json()
				if (data.error) {
					setError(data.error)
				} else if (data.message) {
					setError(data.message)
				} else {
					setError('Something went wrong. Please try again.')
				}
			}
		} catch {
			setStatus('error')
			setError('Something went wrong. Please try again.')
		}
	}

	if (dismissed || !show) return null

	return (
		<div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-xl">
				<button
					onClick={dismiss}
					className="absolute top-3 right-3 text-sm text-gray-500 hover:text-black"
					aria-label="Close"
				>
					✕
				</button>

				{status === 'success' ? (
					<div className="text-center py-8">
						<h2 className="text-lg font-semibold">🎉 Subscribed!</h2>
						<p className="text-sm mt-2">Thank you for joining the list.</p>
					</div>
				) : (
					<>
						<h2 className="text-lg font-semibold mb-2">
							Enjoying the content?
						</h2>
						<p className="text-sm mb-4">
							Get monthly DevOps & Kubernetes insights. No spam.
						</p>

						<form onSubmit={handleSubmit} className="space-y-3">
							<div className="flex gap-2 flex-col sm:flex-row">
								<input
									name="firstName"
									type="text"
									placeholder="First name"
									className="w-full border px-3 py-2 rounded"
								/>
								<input
									name="lastName"
									type="text"
									placeholder="Last name"
									className="w-full border px-3 py-2 rounded"
								/>
							</div>
							<input
								name="email"
								type="email"
								required
								placeholder="Email address"
								className="w-full border px-3 py-2 rounded"
							/>
							<button
								type="submit"
								className="w-full bg-black text-white py-2 px-4 rounded"
							>
								Subscribe
							</button>
							{status === 'error' && (
								<p className="text-sm text-red-500">
									{error || 'Something went wrong. Please try again.'}
								</p>
							)}
						</form>
					</>
				)}
			</div>
		</div>
	)
}
