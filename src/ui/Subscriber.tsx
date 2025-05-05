'use client'

import { useEffect, useState } from 'react'

export default function Subscriber() {
	const [show, setShow] = useState(false)
	const [dismissed, setDismissed] = useState(false)
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const isDismissed = sessionStorage.getItem('subscriberDismissed') === 'true'
		const isSubscribed =
			localStorage.getItem('subscriberStatus') === 'subscribed'

		if (isDismissed || isSubscribed) {
			setDismissed(true)
			return
		}

		const handleScroll = () => {
			const scrolled = (window.scrollY / document.body.scrollHeight) * 100
			if (scrolled > 60) {
				setShow(true)
				window.removeEventListener('scroll', handleScroll)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const dismiss = () => {
		sessionStorage.setItem('subscriberDismissed', 'true')
		setShow(false)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setStatus('loading')
		setError(null)

		const form = e.currentTarget
		const formData = new FormData(form)

		const payload = {
			email: formData.get('email')?.toString() || '',
			firstName: formData.get('firstName')?.toString() || '',
			lastName: formData.get('lastName')?.toString() || '',
		}

		try {
			const res = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			const data = await res.json()
			if (res.ok) {
				localStorage.setItem('subscriberStatus', 'subscribed')
				setStatus('success')
				form.reset()
				setTimeout(dismiss, 1500)
			} else {
				setStatus('error')
				setError(data?.error || data?.message || 'Something went wrong.')
			}
		} catch {
			setStatus('error')
			setError('Something went wrong. Please try again.')
		}
	}

	if (dismissed || !show) return null

	const renderSuccess = () => (
		<div className="text-center py-8">
			<h2 className="text-lg font-semibold">🎉 Subscribed!</h2>
			<p className="text-sm mt-2">Thank you for joining the list.</p>
		</div>
	)

	const renderForm = () => (
		<>
			<h2 className="text-lg font-semibold mb-2">Enjoying the content?</h2>
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
					disabled={status === 'loading'}
					className="w-full bg-black text-white py-2 px-4 rounded flex items-center justify-center gap-2"
				>
					{status === 'loading' && (
						<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
					)}
					{status === 'loading' ? 'Subscribing...' : 'Subscribe'}
				</button>
				{status === 'error' && (
					<p className="text-sm text-red-500">
						{error || 'Something went wrong. Please try again.'}
					</p>
				)}
			</form>
		</>
	)

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
				{status === 'success' ? renderSuccess() : renderForm()}
			</div>
		</div>
	)
}
