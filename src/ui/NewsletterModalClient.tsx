'use client'

import NewsletterModal from './NewsletterModal'
import { SUBSCRIBER_STATUS_KEY, SUBSCRIBER_STATUS_SUBSCRIBED } from '@/lib/env'
import { useEffect, useState } from 'react'

export default function NewsletterModalClient() {
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		const alreadySubscribed =
			localStorage.getItem(SUBSCRIBER_STATUS_KEY) ===
			SUBSCRIBER_STATUS_SUBSCRIBED
		if (!alreadySubscribed) {
			const timeout = setTimeout(() => {
				setShowModal(true)
			}, 15000) // 15 seconds
			return () => clearTimeout(timeout)
		}
	}, [])

	return (
		<NewsletterModal
			isOpen={showModal}
			onCloseAction={() => setShowModal(false)}
		/>
	)
}
