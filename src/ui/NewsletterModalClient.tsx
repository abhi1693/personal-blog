'use client'

import { useEffect, useState } from 'react'
import NewsletterModal from './NewsletterModal'

export default function NewsletterModalClient() {
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		const alreadySubscribed = localStorage.getItem('subscriberStatus') === 'subscribed'
		if (!alreadySubscribed) {
			const timeout = setTimeout(() => {
				setShowModal(true)
			}, 15000) // 15 seconds
			return () => clearTimeout(timeout)
		}
	}, [])

	return (
		<NewsletterModal isOpen={showModal} onCloseAction={() => setShowModal(false)} />
	)
}
