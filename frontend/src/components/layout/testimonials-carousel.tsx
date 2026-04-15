'use client'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { StarIcon, UserIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { PortableText } from 'next-sanity'
import { useEffect, useRef, useState } from 'react'
import { TestimonialsQueryResult } from '~/sanity.types'
import { SanityImage } from '../sanity-image'

type TestimonialType = TestimonialsQueryResult[number]

const AUTOPLAY_INTERVAL = 7500

export function TestimonialsCarousel({ testimonials }: { testimonials: TestimonialType[] }) {
	const [api, setApi] = useState<CarouselApi>()

	return (
		<div className='relative'>
			<div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background to-transparent sm:w-32 xl:w-12' />
			<div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent sm:w-32 xl:w-12' />
			<Carousel
				setApi={setApi}
				opts={{
					align: 'center',
					dragFree: false,
					loop: true,
					breakpoints: {
						'(min-width: 1280px)': { align: 'start' }
					}
				}}
				className='w-full xl:[&>div]:px-6'>
				<CarouselContent className='-ml-4'>
					{testimonials.map(t => (
						<CarouselItem key={t._id} className='basis-[90%] pl-4 lg:basis-[80%] xl:basis-[50%]'>
							<ReviewCard testimonial={t} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<TestimonialsControls api={api} total={testimonials.length} />
		</div>
	)
}

function TestimonialsControls({ api, total }: { api: CarouselApi; total: number }) {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [timerKey, setTimerKey] = useState(0)

	useEffect(() => {
		if (!api) return
		const onSelect = () => {
			setSelectedIndex(api.selectedScrollSnap())
			setTimerKey(k => k + 1)
		}
		api.on('select', onSelect)
		return () => {
			api.off('select', onSelect)
		}
	}, [api])

	// Autoplay — resets on every timerKey change (manual or auto navigation)
	useEffect(() => {
		if (!api) return
		const t = setTimeout(() => api.scrollNext(), AUTOPLAY_INTERVAL)
		return () => clearTimeout(t)
	}, [api, timerKey])

	return (
		<div className='mt-6 flex items-center justify-center gap-1.5'>
			{Array.from({ length: total }).map((_, i) => (
				<button
					key={i}
					type='button'
					onClick={() => api?.scrollTo(i)}
					aria-label={`Opinia ${i + 1}`}
					className='relative h-0.75 w-6 overflow-hidden rounded-full bg-foreground/20 sm:w-8'>
					{i === selectedIndex ? (
						<motion.span
							key={timerKey}
							className='absolute inset-y-0 left-0 h-full w-full origin-left rounded-full bg-foreground'
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
						/>
					) : (
						<span
							className={cn(
								'absolute inset-0 h-full rounded-full transition-opacity'
								// i < selectedIndex ? 'bg-foreground' : ''
							)}
						/>
					)}
				</button>
			))}
		</div>
	)
}

function ReviewCard({ testimonial: t }: { testimonial: TestimonialType }) {
	const quoteRef = useRef<HTMLDivElement | null>(null)
	const [isTruncated, setIsTruncated] = useState(false)

	useEffect(() => {
		const el = quoteRef.current
		if (!el) return

		const checkIsTruncated = () => {
			setIsTruncated(el.scrollHeight > el.clientHeight + 1)
		}

		checkIsTruncated()

		const resizeObserver = new ResizeObserver(checkIsTruncated)
		resizeObserver.observe(el)

		window.addEventListener('resize', checkIsTruncated)

		return () => {
			resizeObserver.disconnect()
			window.removeEventListener('resize', checkIsTruncated)
		}
	}, [t.quote])

	return (
		<div className='grain-overlay-25% relative z-0 flex h-full flex-col gap-4 overflow-hidden rounded-4xl border border-white/5 bg-gradient-secondary py-3 pr-6 pl-3 after:-z-10 sm:h-80 sm:flex-row sm:gap-10'>
			{/* Photo */}
			<div className='relative aspect-square h-auto w-full shrink-0 overflow-hidden rounded-3xl border border-primary/15 sm:size-32 md:h-full md:w-auto'>
				{t.image ? (
					<SanityImage
						image={t.image}
						alt={t.name}
						placeholder={'blur'}
						className='size-full object-cover object-center'
						sizes='240px'
					/>
				) : (
					<PlaceholderImage />
				)}
			</div>

			{/* Content */}
			<div className='relative flex h-full min-w-0 flex-col justify-between gap-10 py-4 max-sm:px-4 sm:py-2 md:py-4'>
				<div className='flex flex-col gap-4'>
					<p className='font-heading text-4xl leading-[1.15]'>{t.name}</p>
					<div ref={quoteRef} className='line-clamp-5 font-body text-sm leading-relaxed! text-foreground/85'>
						<PortableText
							value={t.quote}
							components={{
								block: {
									normal: ({ children }) => <p>{children}</p>
								}
							}}
						/>
					</div>
					{isTruncated ? (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant='link' size='sm' className='h-auto w-max p-0 text-primary normal-case'>
									Czytaj dalej
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl rounded-3xl!'>
								<DialogHeader>
									<div className='flex items-start gap-4'>
										{/* image */}
										<div className='relative size-16 overflow-hidden rounded-lg border border-primary/15'>
											{t.image ? (
												<SanityImage
													image={t.image}
													alt={t.name}
													placeholder={'blur'}
													className='object-cover object-center'
													sizes='96px'
												/>
											) : (
												<PlaceholderImage />
											)}
										</div>

										<div className='flex flex-col gap-1'>
											<DialogTitle className='font-heading text-3xl leading-tight font-normal'>{t.name}</DialogTitle>
											{/* stars */}
											<div className='flex gap-0.5'>
												{Array.from({ length: Math.min(t.rating, 5) }).map((_, i) => (
													<StarIcon key={i} className='size-4 fill-primary text-primary' />
												))}
											</div>
										</div>
									</div>
									<DialogDescription />
								</DialogHeader>
								<div className='font-body text-base leading-relaxed text-white/90'>
									<PortableText
										value={t.quote}
										components={{
											block: {
												normal: ({ children }) => <p>{children}</p>
											}
										}}
									/>
								</div>
							</DialogContent>
						</Dialog>
					) : null}
				</div>

				{/* Stars */}
				<div className='flex gap-0.5'>
					{Array.from({ length: Math.min(t.rating, 5) }).map((_, i) => (
						<StarIcon key={i} className='size-4 fill-primary text-primary' />
					))}
				</div>
			</div>
		</div>
	)
}

const PlaceholderImage = () => (
	<div className='flex size-full items-center justify-center bg-muted'>
		<UserIcon className='size-10 text-muted-foreground' />
	</div>
)
