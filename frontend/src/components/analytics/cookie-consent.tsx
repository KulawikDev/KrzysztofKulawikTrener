'use client'

import { CONSENT_SETTINGS_EVENT } from '@/config/analytics'
import { readConsent, saveConsent, type ConsentChoice } from '@/lib/analytics/gtag'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Cookie banner wired to Consent Mode v2.
 *
 * Nothing is granted until the visitor chooses — the denied defaults are already set by
 * the bootstrap snippet in <GoogleTag />, this component only ever sends `consent: update`.
 * Can be re-opened later through `openCookieSettings()` so consent can be withdrawn.
 */
export function CookieConsent() {
	const [isOpen, setIsOpen] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const [showDetails, setShowDetails] = useState(false)
	const [analytics, setAnalytics] = useState(true)
	const [marketing, setMarketing] = useState(true)

	// Decide visibility on the client only — localStorage is not available during SSR.
	useEffect(() => {
		if (!readConsent()) setIsOpen(true)
	}, [])

	// Allow re-opening from anywhere (footer link), pre-filled with the current choice.
	useEffect(() => {
		const onReopen = () => {
			const stored = readConsent()
			setAnalytics(stored?.analytics ?? true)
			setMarketing(stored?.marketing ?? true)
			setShowDetails(true)
			setIsOpen(true)
		}

		window.addEventListener(CONSENT_SETTINGS_EVENT, onReopen)
		return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, onReopen)
	}, [])

	// Slide in on the frame after mount so the transition actually has a starting point.
	useEffect(() => {
		if (!isOpen) return setIsVisible(false)

		const frame = requestAnimationFrame(() => setIsVisible(true))
		return () => cancelAnimationFrame(frame)
	}, [isOpen])

	const decide = (choice: Pick<ConsentChoice, 'analytics' | 'marketing'>) => {
		saveConsent(choice)
		setIsVisible(false)
		setShowDetails(false)
		setTimeout(() => setIsOpen(false), 200)
	}

	if (!isOpen) return null

	return (
		<div
			role='dialog'
			aria-live='polite'
			aria-label='Ciasteczka'
			className={cn(
				'fixed bottom-4 left-4 z-[100] max-sm:right-4 sm:bottom-6 sm:left-6 sm:max-w-md',
				'transition-all duration-300 ease-out',
				isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
			)}>
			<div className='flex flex-col gap-4 rounded-2xl border border-white/10 bg-background/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl'>
				<div className='flex flex-col gap-1.5'>
					<p className='font-heading text-2xl leading-none text-foreground uppercase'>Ciasteczka</p>
					<p className='font-body text-[13px] leading-relaxed text-balance text-foreground/60'>
						Korzystam z plików cookie, aby zapewnić poprawne działanie strony, analizować ruch i personalizować reklamy.
						Szczegóły znajdziesz w{' '}
						<Link
							href='/legal/polityka-prywatnosci'
							className='text-foreground/80 underline underline-offset-2 transition-colors hover:text-primary'>
							polityce prywatności
						</Link>
						.
					</p>
				</div>

				{showDetails && (
					<div className='flex flex-col gap-3 border-t border-white/10 pt-4'>
						<ConsentSwitch label='Niezbędne' hint='Bez nich strona nie ruszy.' checked disabled />
						<ConsentSwitch
							label='Statystyka'
							hint='Ile osób zagląda i skąd.'
							checked={analytics}
							onChange={setAnalytics}
						/>
						<ConsentSwitch
							label='Marketing'
							hint='Które reklamy mają sens.'
							checked={marketing}
							onChange={setMarketing}
						/>
					</div>
				)}

				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => decide({ analytics: true, marketing: true })}
						className='flex-1 rounded-xl bg-primary px-4 py-2.5 font-heading text-base leading-none text-primary-foreground uppercase transition-opacity hover:opacity-90'>
						Zgadzam się
					</button>
					<button
						type='button'
						onClick={() => decide(showDetails ? { analytics, marketing } : { analytics: false, marketing: false })}
						className='rounded-xl border border-white/15 px-4 py-2.5 font-heading text-base leading-none text-foreground/80 uppercase transition-colors hover:border-white/30 hover:text-foreground'>
						{showDetails ? 'Zapisz' : 'Nie teraz'}
					</button>
				</div>

				{!showDetails && (
					<button
						type='button'
						onClick={() => setShowDetails(true)}
						className='-mt-1 w-max font-body text-xs text-foreground/40 underline-offset-2 transition-colors hover:text-foreground/70 hover:underline'>
						Wybiorę sam
					</button>
				)}
			</div>
		</div>
	)
}

// ── Primitives ────────────────────────────────────────────────────────────────

type ConsentSwitchProps = {
	label: string
	hint: string
	checked: boolean
	disabled?: boolean
	onChange?: (checked: boolean) => void
}

const ConsentSwitch = ({ label, hint, checked, disabled, onChange }: ConsentSwitchProps) => (
	<label className={cn('flex items-center justify-between gap-4', disabled ? 'opacity-40' : 'cursor-pointer')}>
		<span className='flex flex-col gap-0.5'>
			<span className='font-heading text-lg leading-none text-foreground uppercase'>{label}</span>
			<span className='font-body text-[11px] leading-none text-foreground/45'>{hint}</span>
		</span>

		<input
			type='checkbox'
			checked={checked}
			disabled={disabled}
			onChange={e => onChange?.(e.target.checked)}
			className='peer sr-only'
		/>
		<span className='relative h-5 w-9 shrink-0 rounded-full bg-white/15 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:[&>span]:translate-x-4'>
			<span className='absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform duration-200' />
		</span>
	</label>
)
