'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { ContactEmailPayload, ContactEmailValidator } from '@/lib/validators/contactForm'
import { Button } from '@/components/ui/button'

// ── Steps ─────────────────────────────────────────────────────────────────────

const STEPS = [
	{ id: 0, question: 'Jak masz na imię?', hint: 'Tak będę się do Ciebie zwracać.' },
	{ id: 1, question: 'Jak się z Tobą skontaktować?', hint: 'Email wystarczy — telefon opcjonalnie.' },
	{ id: 2, question: 'Czego szukasz?', hint: 'Opisz swój cel, sytuację albo pytanie.' },
] as const

const slideVariants = {
	enter: (dir: number) => ({ opacity: 0, y: dir * 20, filter: 'blur(4px)' }),
	center: { opacity: 1, y: 0, filter: 'blur(0px)' },
	exit: (dir: number) => ({ opacity: 0, y: dir * -20, filter: 'blur(4px)' }),
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FooterContact() {
	const [step, setStep] = useState(0)
	const [dir, setDir] = useState(1)
	const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
	const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
	const { executeRecaptcha } = useGoogleReCaptcha()

	const form = useForm<ContactEmailPayload>({
		resolver: zodResolver(ContactEmailValidator),
		defaultValues: { name: '', naekjsdvbgs: '', email: '', phone: '', message: '', recaptchaToken: undefined },
	})

	const refreshToken = useCallback(async () => {
		if (!executeRecaptcha) return
		form.setValue('recaptchaToken', await executeRecaptcha('contact_form_submit'))
	}, [executeRecaptcha, form])

	useEffect(() => { refreshToken() }, [refreshToken])

	// Auto-focus first input after step transitions
	useEffect(() => {
		const t = setTimeout(() => firstInputRef.current?.focus(), 280)
		return () => clearTimeout(t)
	}, [step])

	const goNext = async () => {
		const ok = await form.trigger(step === 0 ? ['naekjsdvbgs'] : ['email'])
		if (!ok) return
		setDir(1)
		setStep(s => s + 1)
	}

	const goPrev = () => { setDir(-1); setStep(s => s - 1) }

	const onSubmit = form.handleSubmit(async values => {
		if (!(await form.trigger('message'))) return
		setStatus('sending')
		await refreshToken()
		try {
			const res = await fetch('/api/contactForm', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...values, recaptchaToken: form.getValues('recaptchaToken') }),
			})
			if (!res.ok) throw new Error()
			setStatus('success')
		} catch {
			setStatus('error')
			setTimeout(() => setStatus('idle'), 4000)
		}
	})

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && step < 2) { e.preventDefault(); goNext() }
	}

	const errors = form.formState.errors

	return (
		<div className='relative grid-container container-fill border-t border-white/5 py-20'>
			<div className='grid grid-cols-1 gap-16 lg:grid-cols-[1fr_auto]'>

				{/* ── Form ─────────────────────────────────────────────────────────── */}
				<div className='flex max-w-2xl flex-col'>
					<AnimatePresence mode='wait'>
						{status === 'success' ? (
							<SuccessState
								key='success'
								onReset={() => { setStatus('idle'); setStep(0); form.reset() }}
							/>
						) : (
							<motion.div key='form' initial={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col gap-10'>

								{/* Step counter */}
								<div className='flex items-center gap-4'>
									<span className='font-heading text-[4rem] leading-none text-primary'>
										{String(step + 1).padStart(2, '0')}
									</span>
									<div className='flex flex-col gap-1'>
										<div className='flex gap-1.5'>
											{STEPS.map((_, i) => (
												<motion.div
													key={i}
													animate={{ width: i === step ? 24 : 12, opacity: i <= step ? 1 : 0.2 }}
													transition={{ duration: 0.35, ease: 'easeInOut' }}
													className='h-px rounded-full bg-primary'
												/>
											))}
										</div>
										<span className='font-body text-xs text-foreground/30 tabular-nums'>{step + 1} / {STEPS.length}</span>
									</div>
								</div>

								{/* Hidden honeypot */}
								<input {...form.register('name')} type='text' tabIndex={-1} aria-hidden className='sr-only' autoComplete='off' />

								{/* Question + fields */}
								<form onSubmit={onSubmit} className='flex flex-col gap-10'>
									<AnimatePresence mode='wait' custom={dir}>
										<motion.div
											key={step}
											custom={dir}
											variants={slideVariants}
											initial='enter'
											animate='center'
											exit='exit'
											transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
											className='flex flex-col gap-8'
										>
											<div>
												<p className='font-heading text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-foreground'>
													{STEPS[step].question}
												</p>
												<p className='mt-2 font-body text-sm text-foreground/40'>{STEPS[step].hint}</p>
											</div>

											<div className='flex flex-col gap-4' onKeyDown={handleKeyDown}>
												{step === 0 && (
													<UnderlineField
														inputRef={el => { firstInputRef.current = el }}
														{...form.register('naekjsdvbgs')}
														placeholder='Jan Kowalski'
														autoComplete='name'
														error={errors.naekjsdvbgs?.message}
													/>
												)}
												{step === 1 && (
													<>
														<UnderlineField
															inputRef={el => { firstInputRef.current = el }}
															{...form.register('email')}
															type='email'
															placeholder='jan@example.com'
															autoComplete='email'
															error={errors.email?.message}
														/>
														<UnderlineField
															{...form.register('phone')}
															type='tel'
															placeholder='+48 123 456 789 (opcjonalnie)'
															autoComplete='tel'
															error={errors.phone?.message}
														/>
													</>
												)}
												{step === 2 && (
													<UnderlineTextarea
														textareaRef={el => { firstInputRef.current = el }}
														{...form.register('message')}
														placeholder='Np. "Chcę zacząć od zera, potrzebuję planu..."'
														rows={4}
														error={errors.message?.message}
													/>
												)}
											</div>
										</motion.div>
									</AnimatePresence>

									{/* Nav */}
									<div className='flex items-center gap-6'>
										{step > 0 && (
											<button
												type='button'
												onClick={goPrev}
												className='font-body text-sm text-foreground/30 transition-colors hover:text-foreground/60'>
												← Wstecz
											</button>
										)}
										{step < 2 ? (
											<Button type='button' onClick={goNext} variant='outline' className='rounded-full px-8 gap-2 border-white/15 bg-transparent hover:bg-white/5 hover:border-white/30'>
												Dalej <ArrowRightIcon className='size-4' />
											</Button>
										) : (
											<Button type='submit' disabled={status === 'sending'} className='rounded-full px-8 gap-2'>
												{status === 'sending' ? 'Wysyłam…' : <>Wyślij <ArrowRightIcon className='size-4' /></>}
											</Button>
										)}
									</div>

									<AnimatePresence>
										{status === 'error' && (
											<motion.p
												initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
												className='font-body text-xs text-red-400'>
												Coś poszło nie tak. Spróbuj ponownie.
											</motion.p>
										)}
									</AnimatePresence>

									<p className='font-body text-xs text-foreground/20'>
										Wysyłając wiadomość akceptujesz{' '}
										<Link href='/legal/polityka-prywatnosci' className='underline underline-offset-2 hover:text-foreground/40 transition-colors'>politykę prywatności</Link>.
									</p>
								</form>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* ── Contact info ─────────────────────────────────────────────────── */}
				<div className='flex flex-col justify-between gap-12 lg:items-end lg:text-right'>

					{/* Socials — editorial stacked */}
					<nav className='flex flex-col gap-1' aria-label='Social media'>
						{Object.values(siteConfig.socials).map(s => (
							<a
								key={s.label}
								href={s.value}
								target='_blank'
								rel='noreferrer'
								className='group font-heading text-2xl leading-tight text-foreground/40 transition-colors duration-200 hover:text-foreground'>
								{s.label.toUpperCase()}
							</a>
						))}
					</nav>

					{/* Phone + email */}
					<div className='flex flex-col gap-2'>
						<a
							href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
							className='font-body text-xl font-medium text-foreground/80 transition-colors hover:text-foreground'>
							{siteConfig.phone}
						</a>
						<a
							href={`mailto:${siteConfig.email}`}
							className='font-body text-sm text-foreground/40 transition-colors hover:text-foreground/70'>
							{siteConfig.email}
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

// ── Primitives ────────────────────────────────────────────────────────────────

type UnderlineFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	error?: string
	inputRef?: React.Ref<HTMLInputElement>
}

const UnderlineField = ({ error, inputRef, className, ...props }: UnderlineFieldProps) => (
	<div className='flex flex-col gap-1.5'>
		<input
			ref={inputRef}
			className={cn(
				'w-full border-b border-white/15 bg-transparent py-2 font-body text-xl text-foreground placeholder:text-foreground/20 transition-colors focus:border-primary focus:outline-none',
				error && 'border-red-400/50',
				className
			)}
			{...props}
		/>
		{error && <p className='font-body text-xs text-red-400'>{error}</p>}
	</div>
)

type UnderlineTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	error?: string
	textareaRef?: React.Ref<HTMLTextAreaElement>
}

const UnderlineTextarea = ({ error, textareaRef, className, ...props }: UnderlineTextareaProps) => (
	<div className='flex flex-col gap-1.5'>
		<textarea
			ref={textareaRef}
			className={cn(
				'w-full resize-none border-b border-white/15 bg-transparent py-2 font-body text-xl text-foreground placeholder:text-foreground/20 transition-colors focus:border-primary focus:outline-none',
				error && 'border-red-400/50',
				className
			)}
			{...props}
		/>
		{error && <p className='font-body text-xs text-red-400'>{error}</p>}
	</div>
)

function SuccessState({ onReset }: { onReset: () => void }) {
	return (
		<motion.div
			key='success'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='flex min-h-[280px] flex-col justify-center gap-6'>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 22 }}
				className='flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary'>
				<CheckIcon className='size-7 stroke-[1.5]' />
			</motion.div>
			<div>
				<p className='font-heading text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] text-foreground'>Świetnie!</p>
				<p className='mt-2 font-body text-sm text-foreground/50'>
					Twoja wiadomość dotarła. Odezwę się w ciągu 24 godzin.
				</p>
			</div>
			<button
				type='button'
				onClick={onReset}
				className='w-max font-body text-sm text-foreground/25 underline-offset-2 transition-colors hover:text-foreground/50 hover:underline'>
				Wyślij kolejną wiadomość
			</button>
		</motion.div>
	)
}
