'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { StarIcon, User, UserIcon } from 'lucide-react'
import { PortableText, type PortableTextBlock } from 'next-sanity'
import Image from 'next/image'
import { TestimonialsQueryResult } from '~/sanity.types'
import { SanityImage } from '../sanity-image'

type TestimonialType = TestimonialsQueryResult[number]

export function TestimonialsCarousel({ testimonials }: { testimonials: TestimonialType[] }) {
	return (
		<Carousel opts={{ align: 'start', dragFree: false }} className='w-full'>
			<CarouselContent className='-ml-4'>
				{testimonials.map(t => (
					<CarouselItem key={t._id} className='basis-[50%] pl-4'>
						<ReviewCard testimonial={t} />
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
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
		<div className='grain-overlay-25% relative z-0 flex h-80 gap-10 overflow-hidden rounded-4xl border border-white/5 bg-gradient-secondary py-3 pr-6 pl-3 after:-z-10'>
			{/* Photo */}
			<div className='relative aspect-square h-full w-auto shrink-0 overflow-hidden rounded-3xl border border-primary/15'>
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
			<div className='relative flex min-w-0 flex-col justify-between gap-10 py-4'>
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
