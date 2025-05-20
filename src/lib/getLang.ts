'use client'

import { BLOG_DIR } from '@/lib/env'
import { languages } from '@/lib/i18n'
import { usePathname } from 'next/navigation'

export default function useLang() {
	const pathname = usePathname()

	const { lang } =
		pathname.match(
			new RegExp(`^/(${BLOG_DIR}/)?(?<lang>[${languages.join('|')}]+)`),
		)?.groups ?? {}

	return lang || languages?.[0] || 'en'
}
