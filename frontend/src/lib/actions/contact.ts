'use server'

import { siteConfig } from '@/config/site'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ContactFormState = {
	success: boolean
	errorKey?: string
}

type ContactPayload = {
	name?: string        // honeypot
	naekjsdvbgs: string  // real name
	email: string
	phone?: string
	message: string
}

export async function sendContactEmail(payload: ContactPayload): Promise<ContactFormState> {
	if (payload.name) return { success: true }

	const name = payload.naekjsdvbgs?.trim()
	const email = payload.email?.trim()
	const phone = payload.phone?.trim()
	const message = payload.message?.trim()

	if (!name || name.length < 2) return { success: false, errorKey: 'invalid_name' }
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, errorKey: 'invalid_email' }
	if (!message) return { success: false, errorKey: 'invalid_message' }

	const phoneLine = phone ? `\nTelefon: ${phone}` : ''

	try {
		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: siteConfig.email,
			replyTo: email,
			subject: `Nowa wiadomość od ${name}`,
			text: `Imię i nazwisko: ${name}\nEmail: ${email}${phoneLine}\n\nWiadomość:\n${message}`
		})
		return { success: true }
	} catch (error) {
		console.error('[Resend] Error sending email:', error)
		return { success: false, errorKey: 'send_error' }
	}
}
