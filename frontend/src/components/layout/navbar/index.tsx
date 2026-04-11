'use client'

import { buttonVariants } from '@/components/ui/button'
import { NAVBAR_LINKS } from '@/config/links'
import { useScrollPosition } from '@/hooks/use-scroll-position'
import { cn } from '@/lib/utils'
import { HomeIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import Wordmark from '~/public/assets/wordmark.png'
import { MobileMenu } from './mobile-menu'

type Props = {}

const Navbar = ({}: Props) => {
	const { y } = useScrollPosition()
	const [isActive, setIsActive] = useState(false)

	const links = NAVBAR_LINKS

	useEffect(() => {
		if (y > 10) {
			if (!isActive) {
				setIsActive(true)
			}
		} else {
			if (isActive) {
				setIsActive(false)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [y])

	return (
		<header
			className={cn(
				'fixed top-0 left-0 z-[49] w-full [body[data-scroll-locked="1"]_&]:translate-x-[calc(-1/2*var(--removed-body-scroll-bar-size))]'
			)}>
			<div
				className={cn(
					'grid-container border-transparent bg-transparent text-foreground transition-colors duration-300 [body:has([data-reverse-nav])_&]:text-background',
					isActive && 'border-border bg-secondary shadow-sm'
				)}>
				<nav className={cn('relative flex h-20 items-center justify-between px-0 py-4', isActive && '')}>
					<Link href={'/'} className={cn('not-link z-50 w-max duration-300', isActive && '')}>
						<Image
							src={Wordmark}
							alt='Logo SpediGuide'
							className={cn(
								'h-14 w-auto duration-300',
								isActive ? '' : '[body:has([data-reverse-nav])_&]:text-background'
							)}
						/>
						<span className='sr-only'>Strona główna</span>
					</Link>

					<ul
						className={cn(
							'absolute-center hidden flex-wrap items-center justify-center gap-x-2 md:flex xl:gap-6',
							isActive && 'text-foreground'
						)}>
						{links.map((link, i) => (
							<li key={link.href}>
								<Link href={link.href} className='link link-underline-slide py-0.5 text-base'>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					<div className='flex items-center gap-x-4 md:hidden'>
						<Suspense>
							<MobileMenu
								setIsNavActive={setIsActive}
								isNavActive={isActive}
								links={[
									{
										href: '/',
										label: 'Strona główna',
										Icon: HomeIcon
									},
									...links
								]}
							/>
						</Suspense>
					</div>

					<div className='hidden md:flex'>
						<Link href={'/'} className={cn(buttonVariants({ variant: 'default' }))}>
							<span>Take Action</span>
							<ShoppingCartIcon className='size-4' />
						</Link>
					</div>
				</nav>
			</div>
		</header>
	)
}

export default Navbar
