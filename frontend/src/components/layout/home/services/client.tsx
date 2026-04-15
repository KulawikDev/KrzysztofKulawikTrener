'use client'

import { useCarousel } from '@/components/carousel/carousel'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ServicePill = { _id: string; label: string }

function ServicesPills({ services }: { services: ServicePill[] }) {
	const { selectedIndex, scrollTo } = useCarousel()

	return (
		<div className='hidden flex-wrap gap-2 md:flex'>
			{services.map((s, i) => (
				<button
					key={s._id}
					onClick={() => scrollTo(i)}
					className={cn(
						'rounded-full px-4 py-2 font-heading text-sm tracking-wider uppercase transition-all duration-300',
						selectedIndex === i
							? 'bg-primary text-primary-foreground'
							: 'bg-secondary text-foreground/50 hover:bg-secondary/80 hover:text-foreground'
					)}>
					{s.label}
				</button>
			))}
		</div>
	)
}

function SlidesCounter({ services }: { services: ServicePill[] }) {
	const { selectedIndex } = useCarousel()

	return (
		<div className='tracking-wider uppercase md:hidden'>
			<span className='text-2xl text-foreground'>{selectedIndex + 1}</span>
			<span className='text-lg text-foreground/50'>/{services.length}</span>
		</div>
	)
}

function ServicesArrows() {
	const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

	return (
		<div className='flex shrink-0 gap-2'>
			<button
				onClick={scrollPrev}
				disabled={!canScrollPrev}
				aria-label='Poprzednia usługa'
				className={cn(
					'flex size-10 items-center justify-center rounded-full bg-secondary transition-all duration-200',
					canScrollPrev ? 'hover:bg-primary hover:text-primary-foreground' : 'cursor-not-allowed opacity-30'
				)}>
				<ChevronLeft className='size-5' />
			</button>
			<button
				onClick={scrollNext}
				disabled={!canScrollNext}
				aria-label='Następna usługa'
				className={cn(
					'flex size-10 items-center justify-center rounded-full bg-secondary transition-all duration-200',
					canScrollNext ? 'hover:bg-primary hover:text-primary-foreground' : 'cursor-not-allowed opacity-30'
				)}>
				<ChevronRight className='size-5' />
			</button>
		</div>
	)
}

export function ServicesControls({ services }: { services: ServicePill[] }) {
	return (
		<div className='mt-8 flex items-center justify-between gap-4'>
			<ServicesPills services={services} />
			<SlidesCounter services={services} />
			<ServicesArrows />
		</div>
	)
}
