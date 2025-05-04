'use server'

import { langCookieName } from '@/lib/i18n'
import { cookies } from 'next/headers'

export async function setLangCookie(lang?: string) {
	if (!lang) return
	;(await cookies()).set(langCookieName, lang)
}
