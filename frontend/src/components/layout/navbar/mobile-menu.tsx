'use client'

import { buttonVariants } from '@/components/ui/button'
import { NavigationLink } from '@/config/links'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { useScrollLock } from '@/hooks/use-scroll-block'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Sling as Hamburger } from 'hamburger-react'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RefObject, useEffect, useRef, useState } from 'react'

export const dynamic = 'force-dynamic'

export const MobileMenu = ({
	isNavActive,
	links,
	setIsNavActive
}: {
	isNavActive: boolean
	links: NavigationLink[]
	setIsNavActive: (state: boolean) => void
}) => {
	const pathname = usePathname()
	const isMd = useMediaQuery('(min-width: 768px)', { initializeWithValue: false })
	const menuRef = useRef<HTMLDivElement>(null)

	const { lock, unlock } = useScrollLock()
	const [isOpen, setIsOpen] = useState(false)

	const isActiveLink = (href: string) => {
		if (href === '/') return pathname === '/'
		return pathname.startsWith(href)
	}

	const panelVariants = {
		hidden: { opacity: 0, y: '-100%' },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: '-100%' }
	}

	useEffect(() => {
		if (isOpen) {
			setIsNavActive(true)
			lock()
		} else {
			unlock()
		}

		return () => unlock()
	}, [isOpen])

	useOnClickOutside(menuRef as RefObject<HTMLElement>, () => {
		if (isOpen) setIsOpen(false)
	})

	if (isMd) return null

	return (
		<>
			<div
				className={cn(
					'z-50 text-inherit md:hidden',
					isNavActive && 'text-foreground',
					isOpen && 'pointer-events-none'
				)}>
				<Hamburger
					toggled={isOpen}
					size={24}
					toggle={toggle => setIsOpen(toggle)}
					label='Otwórz nawigację'
					rounded
					hideOutline={false}
				/>
			</div>

			<AnimatePresence mode='wait'>
				{isOpen && (
					<>
						<motion.div
							className='absolute -inset-x-4 top-full z-40 overflow-auto border bg-muted p-4 shadow-2xl md:hidden'
							ref={menuRef}
							initial='hidden'
							animate='visible'
							exit='exit'
							variants={panelVariants}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
							<div className='space-y-2'>
								{links.map((link, index) => (
									<Link
										key={`${link.href}-${index}`}
										href={link.href}
										onClick={() => setIsOpen(false)}
										className={cn(
											'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground',
											isActiveLink(link.href) &&
												'pointer-events-none border border-primary/25 bg-primary/10 text-primary'
										)}>
										{link.Icon && <link.Icon className='size-4' />}
										<span>{link.label}</span>
									</Link>
								))}
							</div>

							<div className='mt-8 border-t pt-4'>
								<Link href={'/ebook'} className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
									<span>Kup E-Book</span>
									<ShoppingCartIcon className='size-4' />
								</Link>
							</div>
						</motion.div>

						<motion.div
							className='fixed inset-0 -z-10 bg-black/10 backdrop-blur-sm'
							onClick={() => setIsOpen(false)}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						/>
					</>
				)}
			</AnimatePresence>
		</>
	)
}
