import { useEffect, useState } from 'react'

export default function useMatchMedia(query: string) {
	const [isMatch, setIsMatch] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const media = window.matchMedia(query)
		const handleMatchMedia = () => setIsMatch(media.matches)

		handleMatchMedia()
		media.addEventListener('change', handleMatchMedia)

		return () => media.removeEventListener('change', handleMatchMedia)
	}, [query])

	return isMatch
}

export function useIsDesktop() {
	return useMatchMedia('(pointer: fine), (width >= 48rem)')
}
