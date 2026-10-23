import { Resend } from 'resend'

let client: Resend | undefined

export function getResendClient() {
	return (client ??= new Resend(process.env.RESEND_API_KEY_FULL))
}
