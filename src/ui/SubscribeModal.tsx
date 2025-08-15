'use client'

import SubscriberForm from './SubscriberForm'
import { SUBSCRIBER_STATUS_KEY, SUBSCRIBER_STATUS_SUBSCRIBED } from '@/lib/env'
import { useEffect, useState } from 'react'
import { isSubscribedLocal } from '@/lib/newsletter'

const DISMISS_KEY = 'newsletterModalDismissedAt'
const DISMISS_DAYS = 1

function isDismissedRecently(): boolean {
	try {
		const raw = localStorage.getItem(DISMISS_KEY)
		if (!raw) return false
		const ts = Number(raw)
		if (!Number.isFinite(ts)) return false
		const ageMs = Date.now() - ts
		return ageMs < DISMISS_DAYS * 24 * 60 * 60 * 1000
	} catch {
		return false
	}
}

const isSubscribed = () =>
	isSubscribedLocal(SUBSCRIBER_STATUS_KEY, SUBSCRIBER_STATUS_SUBSCRIBED)

export default function SubscribeModal({ siteName }: { siteName?: string }) {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		// Defer showing slightly to avoid layout jank
		const t = setTimeout(() => {
			if (typeof window === 'undefined') return
			if (isSubscribed()) return
			if (isDismissedRecently()) return
			setOpen(true)
		}, 1800)
		return () => clearTimeout(t)
	}, [])

	const onClose = () => setOpen(false)
	const onNoThanks = () => {
		try {
			localStorage.setItem(DISMISS_KEY, String(Date.now()))
		} catch {}
		onClose()
	}

	if (!open) return null

	return (
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-50 grid place-items-center px-4"
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-ink/60" onClick={onNoThanks} />

			{/* Modal card (theme-aligned) */}
			<div className="relative max-w-2xl w-full rounded-xl border border-ink/10 bg-canvas shadow-2xl text-ink">
				<button
					aria-label="Close"
					onClick={onNoThanks}
					className="absolute right-3 top-3 ghost size-9 rounded-full text-ink/70"
				>
					✕
				</button>

				<div className="p-6 md:p-8">
					<h2 className="mt-1 text-2xl md:text-3xl font-bold text-ink">
						Get the best insights on Kubernetes, DevOps & Cloud
					</h2>

					<ul className="mt-4 grid gap-2 text-sm text-ink/90">
						<li>• Actionable Kubernetes, DevOps & Cloud guides</li>
						<li>• Real-world patterns, templates, and checklists</li>
						<li>• One concise email per week, no fluff</li>
						<li>• Early access to tutorials and deep dives</li>
					</ul>

					<div className="mt-4 text-xs text-ink/80">
						By <span className="font-medium">{siteName || 'our site'}</span> 💡
						— practical, field‑tested content.
					</div>

					<div className="mt-6">
						<SubscriberForm showTitle={false} />
					</div>
				</div>
			</div>
		</div>
	)
}
