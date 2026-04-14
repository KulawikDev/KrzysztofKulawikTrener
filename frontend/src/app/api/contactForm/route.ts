import ContactEmailTemplate from '@/components/emails/contact-email-template'
import { siteConfig } from '@/config/site'
import { mailTransporter } from '@/lib/nodemailer/transporter'
import { ContactEmailValidator } from '@/lib/validators/contactForm'
import { render } from '@react-email/render'
import { z } from 'zod'

const EMAIL = process.env.NODEMAILER_EMAIL || siteConfig.email

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { name, email, message, phone, naekjsdvbgs } = ContactEmailValidator.parse(body)

		if (name) {
			return new Response('Invalid POST request data passed', { status: 422 })
		}

		const recaptchaToken = null // TEMPORARY DISABLE RECAPTCHA

		// Verify recaptcha
		if (recaptchaToken) {
			const secretKey = process.env.RECAPTCHA_SECRET_KEY
			if (!secretKey) return new Response('Could not send email', { status: 500 })

			const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
			const recaptchaRes = await fetch(verificationUrl, {
				method: 'POST'
			})

			const recaptchaJson = await recaptchaRes.json()

			if (!recaptchaJson.success || recaptchaJson.score < 0.5) {
				return new Response('Could not send email', { status: 500 })
			}
		} else {
			return new Response('Could not send email', { status: 500 })
		}

		// Send
		const plainText = `Imię: ${naekjsdvbgs}, Email: ${email}, Telefon: ${phone}, Wiadomość: ${message}`
		const emailHtml = await render(ContactEmailTemplate({ name: naekjsdvbgs, email, message, phone }))

		const data = await mailTransporter.sendMail({
			from: EMAIL,
			to: EMAIL,
			subject: `Formularz kontaktowy - ${email}`,
			text: plainText,
			html: emailHtml
		})

		return new Response(JSON.stringify(data))
	} catch (error) {
		console.log(error)
		if (error instanceof z.ZodError) {
			return new Response('Invalid POST request data passed', { status: 422 })
		}

		return new Response('Could not send email', { status: 500 })
	}
}
