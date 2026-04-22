'use server'

import { ContactConfirmationEmail } from '@/components/emails/contact-confirmation'
import { ContactNotificationEmail } from '@/components/emails/contact-notification'
import { siteConfig } from '@/config/site'
import { render } from '@react-email/render'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = 'Krzysztof Kulawik <email@krzysztofkulawik.pl>'

export type ContactFormState = {
	success: boolean
	errorKey?: string
}

type ContactPayload = {
	name?: string       // honeypot
	naekjsdvbgs: string // real name
	email: string
	phone?: string
	message: string
}

export async function sendContactEmail(payload: ContactPayload): Promise<ContactFormState> {
	if (payload.name) return { success: true }

	const name = payload.naekjsdvbgs?.trim()
	const email = payload.email?.trim()
	const phone = payload.phone?.trim() || undefined
	const message = payload.message?.trim()

	if (!name || name.length < 2) return { success: false, errorKey: 'invalid_name' }
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, errorKey: 'invalid_email' }
	if (!message) return { success: false, errorKey: 'invalid_message' }

	const [notificationHtml, confirmationHtml] = await Promise.all([
		render(ContactNotificationEmail({ name, email, message, phone })),
		render(ContactConfirmationEmail({ name, message })),
	])

	try {
		const res = await resend.emails.send({
			from: FROM_ADDRESS,
			to: siteConfig.email,
			replyTo: email,
			subject: `Nowe zapytanie - ${name}`,
			html: notificationHtml,
		})

		console.log('[Resend] Email sent successfully:', res)
	} catch (error) {
		console.error('[Resend] Failed to send notification email:', error)
		return { success: false, errorKey: 'send_error' }
	}

	// Confirmation to client is best-effort - don't fail the form if it errors
	resend.emails.send({
		from: FROM_ADDRESS,
		to: email,
		subject: 'Dziękuję za wiadomość!',
		html: confirmationHtml,
	}).then((res) => {
		console.log('[Resend] Confirmation email send initiated:', res)
	}).catch(err => console.error('[Resend] Failed to send confirmation email:', err))


	return { success: true }
}
