'use client'

import { Button } from '@/components/ui/button'
import { NAVBAR_LINKS } from '@/config/links'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { MenuIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import Wordmark from '~/public/assets/wordmark.png'
import { NavPanel } from './nav-panel'

const iconVariants = {
	enter: { rotate: -90, opacity: 0, scale: 0.5 },
	center: { rotate: 0, opacity: 1, scale: 1, transition: { duration: 0.18, ease: 'easeOut' } },
	exit: { rotate: 90, opacity: 0, scale: 0.5, transition: { duration: 0.12, ease: 'easeIn' } }
}

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<>
			<header
				className={cn(
					'pointer-events-none fixed top-0 left-0 z-60 w-full transition-colors duration-300',
					!isMenuOpen && 'mix-blend-difference',
					'[body[data-scroll-locked="1"]_&]:translate-x-[calc(-1/2*var(--removed-body-scroll-bar-size))]'
				)}>
				<div
					className={cn(
						'grid-container text-foreground',
						!isMenuOpen && '[body:has([data-reverse-nav])_&]:text-background'
					)}>
					<nav className='relative flex h-20 items-center justify-between py-4'>
						<Link href='/' className='not-link pointer-events-auto z-50 w-max'>
							<Image src={Wordmark} alt='Logo Krzysztof Kulawik' className='h-14 w-auto' />
							<span className='sr-only'>Strona główna</span>
						</Link>

						<Button
							size='icon'
							className='pointer-events-auto relative size-12 overflow-hidden rounded-full'
							onClick={() => setIsMenuOpen(v => !v)}
							aria-label={isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
							aria-expanded={isMenuOpen}>
							<AnimatePresence mode='wait' initial={false}>
								{isMenuOpen ? (
									<motion.span
										key='close'
										className='absolute inset-0 flex items-center justify-center'
										variants={iconVariants as any}
										initial='enter'
										animate='center'
										exit='exit'>
										<XIcon className='size-6' />
									</motion.span>
								) : (
									<motion.span
										key='open'
										className='absolute inset-0 flex items-center justify-center'
										variants={iconVariants as any}
										initial='enter'
										animate='center'
										exit='exit'>
										<MenuIcon className='size-6' />
									</motion.span>
								)}
							</AnimatePresence>
						</Button>
					</nav>
				</div>
			</header>

			<NavPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={NAVBAR_LINKS} />
		</>
	)
}

export default Navbar
