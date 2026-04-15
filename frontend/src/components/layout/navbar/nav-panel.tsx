'use client'

import { Button } from '@/components/ui/button'
import { NavigationLink } from '@/config/links'
import { siteConfig } from '@/config/site'
import { useScrollLock } from '@/hooks/use-scroll-block'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// ─── Variants ────────────────────────────────────────────────────────────────

const MENU_EASE = [0.76, 0, 0.24, 1] as const
const REVEAL_EASE = [0.33, 1, 0.68, 1] as const

const panelVariants = {
	hidden: { y: '-100%' },
	visible: { y: 0, transition: { ease: MENU_EASE, duration: 0.6 } },
	exit: { y: '-100%', transition: { ease: MENU_EASE, duration: 0.5, delay: 0.05 } }
}

const staggerContainer = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08, delayChildren: 0.28 } }
}

const linkReveal = {
	hidden: { y: '110%' },
	visible: { y: 0, transition: { ease: REVEAL_EASE, duration: 0.65 } }
}

const contactReveal = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { ease: REVEAL_EASE, duration: 0.55, delay: 0.55 } }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface NavPanelProps {
	isOpen: boolean
	onClose: () => void
	links: NavigationLink[]
}

export function NavPanel({ isOpen, onClose, links }: NavPanelProps) {
	const pathname = usePathname()
	const { lock, unlock } = useScrollLock()

	// Close on route change
	useEffect(() => {
		onClose()
	}, [pathname])

	// Scroll lock
	useEffect(() => {
		if (isOpen) lock()
		else unlock()
		return () => unlock()
	}, [isOpen])

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key='nav-panel'
					className='fixed inset-0 z-40 overflow-hidden bg-background'
					variants={panelVariants}
					initial='hidden'
					animate='visible'
					exit='exit'>
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-0 right-0 grid-container overflow-hidden mix-blend-difference'>
						<div className='absolute -inset-y-1/5 right-0 w-120 rotate-12 skew-x-[4deg] bg-primary/5' />
					</div>

					{/* Grain texture */}
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay'
						style={{
							backgroundImage: "url('/images/decoration/grain.png')",
							backgroundSize: '150px',
							backgroundPosition: 'top left'
						}}
					/>

					{/* Content grid */}
					<div className='relative z-10 grid-container h-full'>
						<div className='flex h-full flex-col pt-24'>
							{/* Nav links ──────────────────────────────── */}
							<motion.nav
								aria-label='Nawigacja główna'
								className='mt-4 flex flex-col md:mt-8'
								variants={staggerContainer}
								initial='hidden'
								animate='visible'>
								{links.map((link, i) => (
									<div key={link.href} className='overflow-hidden border-t border-white/10 first:border-t-0'>
										<motion.div variants={linkReveal} className='py-3 md:py-4 lg:py-6'>
											<Link href={link.href} onClick={onClose} className='group flex items-baseline gap-3 md:gap-5'>
												<span className='font-heading text-sm leading-none text-muted-foreground md:text-base'>
													{String(i + 1).padStart(2, '0')}
												</span>
												<span className='font-heading text-[clamp(52px,10vw,140px)] leading-[0.85] text-foreground uppercase transition-colors duration-200 group-hover:text-primary'>
													{link.label}
												</span>
											</Link>
										</motion.div>
									</div>
								))}
								<div className='border-t border-white/10' />
							</motion.nav>

							{/* Contact + CTA ───────────────────────────── */}
							<motion.div
								variants={contactReveal}
								initial='hidden'
								animate='visible'
								className='mt-auto flex flex-col gap-6 pb-8 md:pb-12 lg:flex-row lg:items-end lg:justify-between lg:pb-16'>
								{/* Contact details */}
								<div className='space-y-1'>
									<p className='font-heading text-xs tracking-[0.2em] text-muted-foreground uppercase'>
										Skontaktuj się
									</p>
									{siteConfig.email && (
										<a
											href={`mailto:${siteConfig.email}`}
											className='block font-heading text-[clamp(16px,2.5vw,30px)] leading-snug text-foreground uppercase transition-colors hover:text-primary'>
											{siteConfig.email}
										</a>
									)}
									{siteConfig.phone && (
										<a
											href={`tel:${siteConfig.phone}`}
											className='block font-heading text-[clamp(16px,2.5vw,30px)] leading-snug text-foreground uppercase transition-colors hover:text-primary'>
											{siteConfig.phone}
										</a>
									)}

									{/* Social links */}
									<div className='flex items-center gap-5 pt-2'>
										{Object.values(siteConfig.socials).map(({ label, value, icon: Icon }) => (
											<a
												key={label}
												href={value}
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center gap-2 font-heading text-sm tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground'>
												<Icon className='size-4' />
												{label}
											</a>
										))}
									</div>
								</div>

								{/* CTA button */}
								<Button onClick={onClose} className='w-full lg:w-auto'>
									Umów darmową rozmowę
								</Button>
							</motion.div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
