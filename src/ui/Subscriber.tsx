'use client'

import SubscriberForm from './SubscriberForm'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Subscriber() {
	const [show, setShow] = useState(false)
	const [dismissed, setDismissed] = useState(false)

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
						<SubscriberForm onSuccess={() => setTimeout(dismiss, 1500)} />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
