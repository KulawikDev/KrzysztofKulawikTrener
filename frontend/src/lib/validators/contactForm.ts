import { z } from 'zod'

export const ContactEmailValidator = z.object({
	name: z.string().optional(),
	naekjsdvbgs: z.string().min(2, {
		message: 'Proszę podać poprawne imię'
	}),
	email: z.string().email({
		message: 'Proszę podać poprawny adres e-mail'
	}),
	phone: z.string().optional(),
	message: z.string().min(1, {
		message: 'Proszę wpisać wiadomość'
	}),
	recaptchaToken: z.string().optional()
})

export type ContactEmailPayload = z.infer<typeof ContactEmailValidator>
