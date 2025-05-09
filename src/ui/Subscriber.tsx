'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
			if (scrolled > 30) {
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

	const renderSuccess = () => (
		<div className="text-center py-4">
			<h2 className="text-base font-semibold">🎉 Subscribed!</h2>
			<p className="text-xs mt-2">Thank you for joining the list.</p>
		</div>
	)

	const renderForm = () => (
		<>
			<h2 className="text-base font-semibold mb-1">Enjoying the content?</h2>
			<p className="text-xs mb-3 text-gray-600">
				Get DevOps & Kubernetes insights.
			</p>
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

	return (
		<AnimatePresence>
			{!dismissed && show && (
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 40 }}
					transition={{ duration: 0.3, ease: 'easeOut' }}
					className="fixed bottom-4 left-4 z-50 w-[240px] bg-white shadow-md rounded-lg border p-3 text-sm"
				>
					<div className="relative">
						<button
							onClick={dismiss}
							className="absolute top-1.5 right-2 text-sm text-gray-500 hover:text-black"
							aria-label="Close"
						>
							✕
						</button>
						{status === 'success' ? renderSuccess() : renderForm()}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
