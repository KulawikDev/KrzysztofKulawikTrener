'use client'

import { siteConfig } from '@/config/site'
import { sendContactEmail } from '@/lib/actions/contact'
import { cn } from '@/lib/utils'
import { ContactEmailPayload, ContactEmailValidator } from '@/lib/validators/contactForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

// ── Steps ─────────────────────────────────────────────────────────────────────

const STEPS = [
	{
		id: 0,
		question: (
			<>
				<span>Wolisz napisać bezpośrednio?</span>
				<span className='mt-4 block max-w-lg font-body text-sm leading-snug! text-balance text-foreground/75'>
					Wyślij wiadomość przez formularz, a ja odpiszę tak szybko, jak to możliwe. Możesz też skorzystać z maila lub
					telefonu podanych poniżej.
				</span>
			</>
		)
	},
	{ id: 1, question: 'Jak się z Tobą skontaktować?' },
	{ id: 2, question: 'Czego szukasz?' }
] as const

const slideVariants = {
	enter: (dir: number) => ({ opacity: 0, y: dir * 20, filter: 'blur(4px)' }),
	center: { opacity: 1, y: 0, filter: 'blur(0px)' },
	exit: (dir: number) => ({ opacity: 0, y: dir * -20, filter: 'blur(4px)' })
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FooterContact() {
	const [step, setStep] = useState(0)
	const [dir, setDir] = useState(1)
	const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
	const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

	const form = useForm<ContactEmailPayload>({
		resolver: zodResolver(ContactEmailValidator),
		defaultValues: { name: '', naekjsdvbgs: '', email: '', phone: '', message: '' }
	})

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

	const goPrev = () => {
		setDir(-1)
		setStep(s => s - 1)
	}

	const onSubmit = form.handleSubmit(async values => {
		if (!(await form.trigger('message'))) return
		setStatus('sending')
		try {
			const result = await sendContactEmail(values)
			if (!result.success) throw new Error(result.errorKey)
			setStatus('success')
		} catch {
			setStatus('error')
			setTimeout(() => setStatus('idle'), 4000)
		}
	})

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && step < 2) {
			e.preventDefault()
			goNext()
		}
	}

	const errors = form.formState.errors

	return (
		<div className='relative grid-container container-fill border-t border-white/5 py-16'>
			<div className='grid grid-cols-1 gap-16 rounded-3xl border border-white/[0.07] bg-white/4 p-8 backdrop-blur-md md:p-12 lg:grid-cols-[1fr_auto] lg:p-16'>
				{/* ── Form ─────────────────────────────────────────────────────────── */}
				<div className='flex max-w-xl flex-col'>
					<AnimatePresence mode='wait'>
						{status === 'success' ? (
							<SuccessState
								key='success'
								onReset={() => {
									setStatus('idle')
									setStep(0)
									form.reset()
								}}
							/>
						) : (
							<motion.div key='form' initial={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col gap-10'>
								{/* Step counter */}
								<div className='flex items-end'>
									<span className='font-heading text-[4rem] leading-none text-primary'>
										{String(step + 1).padStart(2, '0')}
									</span>
									<span className='mb-[0.2em] font-heading text-3xl leading-none text-foreground/50'>
										/{String(STEPS.length).padStart(2, '0')}
									</span>
								</div>

								{/* Hidden honeypot */}
								<input
									{...form.register('name')}
									type='text'
									tabIndex={-1}
									aria-hidden
									className='sr-only'
									autoComplete='off'
								/>

								{/* Question + fields */}
								<form onSubmit={onSubmit} className='flex flex-col gap-4'>
									<div className='relative overflow-hidden pt-2'>
										<AnimatePresence mode='popLayout' custom={dir}>
											<motion.div
												key={step}
												custom={dir}
												variants={slideVariants}
												initial='enter'
												animate='center'
												exit='exit'
												transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
												className='flex min-h-54 flex-col gap-6'>
												<div>
													<p className='font-heading text-[clamp(2rem,5vw,3rem)] leading-[0.9] text-foreground'>
														{STEPS[step].question}
													</p>
												</div>

												<div className='flex flex-col gap-4' onKeyDown={handleKeyDown}>
													{step === 0 && (
														<UnderlineField
															inputRef={el => {
																firstInputRef.current = el
															}}
															{...form.register('naekjsdvbgs')}
															placeholder='Podaj swoje imię'
															autoComplete='name'
															error={errors.naekjsdvbgs?.message}
														/>
													)}
													{step === 1 && (
														<>
															<UnderlineField
																inputRef={el => {
																	firstInputRef.current = el
																}}
																{...form.register('email')}
																type='email'
																placeholder='Adres e-mail'
																autoComplete='email'
																error={errors.email?.message}
															/>
															<UnderlineField
																{...form.register('phone')}
																type='tel'
																placeholder='Numer telefonu (opcjonalnie)'
																autoComplete='tel'
																error={errors.phone?.message}
															/>
														</>
													)}
													{step === 2 && (
														<>
															<UnderlineTextarea
																textareaRef={el => {
																	firstInputRef.current = el
																}}
																{...form.register('message')}
																placeholder='Np. "Chcę zacząć od zera, potrzebuję planu..."'
																rows={3}
																error={errors.message?.message}
															/>

															<p className='font-body text-xs text-foreground/75'>
																Wysyłając wiadomość akceptujesz{' '}
																<Link
																	href='/legal/polityka-prywatnosci'
																	className='underline underline-offset-2 transition-colors hover:text-foreground/40'>
																	politykę prywatności
																</Link>
																.
															</p>
														</>
													)}
												</div>
											</motion.div>
										</AnimatePresence>
									</div>

									{/* Nav */}
									<div className='flex flex-row-reverse items-center justify-between gap-6 pt-2'>
										{step < 2 ? (
											<button
												key='next-step'
												type='button'
												onClick={goNext}
												className='group flex items-center gap-3 font-heading text-2xl text-foreground transition-colors hover:text-primary'>
												Dalej
												<ChevronRightIcon className='size-5 transition-transform group-hover:translate-x-0.5' />
											</button>
										) : (
											<button
												key='submit-form'
												type='button'
												onClick={() => void onSubmit()}
												disabled={status === 'sending'}
												className='group flex items-center gap-3 font-heading text-2xl text-primary transition-opacity disabled:opacity-40'>
												{status === 'sending' ? (
													'Wysyłam…'
												) : (
													<>
														Wyślij
														<ChevronRightIcon className='size-5 transition-transform group-hover:translate-x-0.5' />
													</>
												)}
											</button>
										)}
										{step > 0 && (
											<button
												type='button'
												onClick={goPrev}
												className='group flex items-center gap-3 font-heading text-2xl text-foreground/50 transition-colors hover:text-foreground/75'>
												<ChevronLeftIcon className='size-5 transition-transform group-hover:-translate-x-0.5' />
												Wstecz
											</button>
										)}
									</div>

									<AnimatePresence>
										{status === 'error' && (
											<motion.p
												initial={{ opacity: 0, y: 4 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												className='font-body text-xs text-red-400'>
												Coś poszło nie tak. Spróbuj ponownie.
											</motion.p>
										)}
									</AnimatePresence>
								</form>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* ── Contact info ─────────────────────────────────────────────────── */}
				<div className='flex justify-between gap-12 max-sm:flex-col sm:items-end lg:flex-col lg:text-right'>
					{/* Socials — editorial stacked */}
					<nav className='flex flex-row flex-wrap gap-x-8 gap-y-2 sm:flex-col sm:gap-2' aria-label='Social media'>
						{Object.values(siteConfig.socials).map(s => (
							<Link
								key={s.label}
								href={s.value}
								target='_blank'
								rel='noreferrer'
								className='group font-heading text-3xl leading-[1.15] text-foreground transition-colors duration-200 hover:text-primary md:text-3xl lg:text-4xl'>
								{s.label.toUpperCase()}
							</Link>
						))}
					</nav>

					{/* Phone + email */}
					<div className='flex flex-col gap-2 font-heading text-3xl leading-[1.15] text-foreground md:text-3xl lg:text-4xl'>
						<Link
							href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
							className='transition-colors duration-200 hover:text-primary'>
							{siteConfig.phone}
						</Link>
						<Link href={`mailto:${siteConfig.email}`} className='transition-colors duration-200 hover:text-primary'>
							{siteConfig.email}
						</Link>
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
				'w-full border-b border-white/30 bg-transparent py-3 font-body text-lg text-foreground transition-colors placeholder:text-foreground/35 focus:border-primary focus:outline-none',
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
				'w-full resize-none border-b border-white/15 bg-transparent py-2 font-body text-lg text-foreground transition-colors placeholder:text-foreground/20 focus:border-primary focus:outline-none',
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
				className='mb-4 flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary'>
				<CheckIcon className='size-7 stroke-[1.5]' />
			</motion.div>
			<div>
				<p className='font-heading text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] text-foreground'>Świetnie!</p>
				<p className='mt-2 font-body text-sm text-balance text-foreground/50'>
					Twoja wiadomość dotarła. Odezwę się w ciągu 24 godzin.
				</p>
			</div>
			<button
				type='button'
				onClick={onReset}
				className='w-max font-body text-sm text-foreground/50 underline-offset-2 transition-colors hover:text-foreground/75 hover:underline'>
				Wyślij kolejną wiadomość
			</button>
		</motion.div>
	)
}
