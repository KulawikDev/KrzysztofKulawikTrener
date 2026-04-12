'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCarousel } from './carousel'

export function CarouselDots({ className }: { className?: string }) {
	const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()

	return (
		<div className={cn('flex items-center gap-1 md:gap-2', className)}>
			{scrollSnaps.map((_, index) => (
				<motion.button
					key={index}
					onClick={() => scrollTo(index)}
					className={cn(
						'h-1 rounded-full transition-all duration-300',
						selectedIndex === index
							? 'w-6 bg-foreground md:w-8'
							: 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50 md:w-4'
					)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					aria-label={`Przejdź do slajdu ${index + 1}`}
				/>
			))}
		</div>
	)
}

export function CarouselArrows({ className }: { className?: string }) {
	const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

	return (
		<div className={cn('flex items-center gap-3', className)}>
			<Button variant='outline' size='icon' onClick={scrollPrev} disabled={!canScrollPrev} aria-label='Poprzedni slajd'>
				<ArrowLeft className='size-5' />
			</Button>
			<Button variant='outline' size='icon' onClick={scrollNext} disabled={!canScrollNext} aria-label='Następny slajd'>
				<ArrowRight className='size-5' />
			</Button>
		</div>
	)
}
