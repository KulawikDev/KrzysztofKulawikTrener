import { z } from 'zod'

export const ContactEmailValidator = z.object({
	name: z.string().optional(),
	naekjsdvbgs: z.string().min(2, {
		message: 'Nie wstydź się, podaj imię, żebym wiedział, jak się do Ciebie zwracać :)'
	}),
	email: z.string().email({
		message: 'Podaj poprawny adres e-mail, żebym mógł się z Tobą skontaktować'
	}),
	phone: z.string().optional(),
	message: z.string().min(1, {
		message: 'Napisz chociaż kilka słów, żebym wiedział, czego szukasz i jak mogę pomóc'
	})
})

export type ContactEmailPayload = z.infer<typeof ContactEmailValidator>
