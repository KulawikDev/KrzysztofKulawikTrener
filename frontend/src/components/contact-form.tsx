'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ContactEmailPayload, ContactEmailValidator } from '@/lib/validators/contactForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {
	className?: string
}

export const ContactForm = ({ className }: Props) => {
	const { executeRecaptcha } = useGoogleReCaptcha()
	const [isPending, setIsPending] = useState(false)

	const form = useForm<ContactEmailPayload>({
		resolver: zodResolver(ContactEmailValidator),
		defaultValues: {
			name: '',
			naekjsdvbgs: '',
			email: '',
			phone: '',
			message: '',
			recaptchaToken: undefined
		}
	})

	const handleReCaptchaVerify = useCallback(async () => {
		if (!executeRecaptcha) {
			console.log('Execute recaptcha not yet available')
			return
		}

		const token = await executeRecaptcha('contact_form_submit')

		console.log('Set recaptcha token', token)
		form.setValue('recaptchaToken', token)
	}, [executeRecaptcha])

	const sendEmail = async (values: ContactEmailPayload) => {
		const payload: ContactEmailPayload = {
			naekjsdvbgs: values.naekjsdvbgs,
			name: values.name,
			email: values.email,
			message: values.message,
			phone: values.phone,
			recaptchaToken: values.recaptchaToken
		}

		try {
			const res = await fetch('/api/contactForm', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			})

			if (!res.ok) throw new Error('Could not send email')

			form.reset()
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	useEffect(() => {
		handleReCaptchaVerify()
	}, [handleReCaptchaVerify])

	const handleSubmit = async (values: ContactEmailPayload) => {
		console.log('HANDLING SUBMIT')

		setIsPending(true)

		toast.promise(sendEmail(values), {
			loading: 'Wysyłanie wiadomości...',
			success: 'Wiadomość została wysłana',
			error: 'Wystąpił błąd podczas wysyłania wiadomości'
		})

		setIsPending(false)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(e => handleSubmit(e))}
				className={cn('relative z-10 flex flex-col gap-y-6', className)}>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='sr-only grow'>
							<FormLabel></FormLabel>
							<FormControl>
								<Input {...field} className='bg-background' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='naekjsdvbgs'
					render={({ field }) => (
						<FormItem className='grow'>
							<FormLabel>Imię i nazwisko*</FormLabel>
							<FormControl>
								<Input {...field} autoComplete='off' placeholder='Jan Kowalski' className='bg-background' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem className=''>
							<FormLabel>Adres email*</FormLabel>
							<FormControl>
								<Input {...field} placeholder='jankowalski@gmail.com' className='bg-background' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='phone'
					render={({ field }) => (
						<FormItem className='grow'>
							<FormLabel>Numer telefonu</FormLabel>
							<FormControl>
								<Input {...field} placeholder='+48 123 456 789' className='bg-background' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Wiadomość*</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder='Aa...' className='h-full max-h-[200px] min-h-[100px] bg-background' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='mt-auto flex flex-col-reverse gap-3 md:flex-col'>
					<Button variant={'default'} disabled={isPending} type='submit' className='cursor-pointer gap-2'>
						<span className=''>{isPending ? 'Wysyłanie Wiadomości...' : 'Wyślij Wiadomość'}</span>

						{isPending && <Loader2 className='size-4 animate-spin' />}
					</Button>
					<div className='space-y-1'>
						<p className='text-xs text-pretty text-muted-foreground'>
							Wysyłając wiadomość zgadzasz się na przetwarzanie danych osobowych zgodnie z{' '}
							<Link href={'/legal/polityka-prywatnosci'} className='font-medium hover:underline'>
								polityką prywatności
							</Link>
						</p>
						<p className='text-xs text-balance text-muted-foreground'>
							This site is protected by reCAPTCHA and the Google
							<a href='https://policies.google.com/privacy'>Privacy Policy</a> and{' '}
							<a href='https://policies.google.com/terms'>Terms of Service</a> apply.
						</p>
					</div>
				</div>
			</form>
		</Form>
	)
}
