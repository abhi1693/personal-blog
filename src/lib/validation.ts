export function isValidEmail(email: string): boolean {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return regex.test(email)
}

export function sanitizeText(text: string, maxLength = 64): string {
       return text
               .replace(/<[^>]*>/g, '')
               .replace(/[\n\r\t]/g, ' ')
               .slice(0, maxLength)
               .trim()
}
