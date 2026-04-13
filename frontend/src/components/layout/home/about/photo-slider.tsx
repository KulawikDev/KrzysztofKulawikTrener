'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SlidePhoto = {
	src: string
	blurDataURL: string
	alt: string
}

const SLIDE_INTERVAL_MS = 5000
const SWIPE_THRESHOLD = 50 // px

export function AboutPhotoSlider({ photos }: { photos: SlidePhoto[] }) {
	const [current, setCurrent] = useState(0)
	const [timerKey, setTimerKey] = useState(0)

	// Navigate to a specific index and restart the timer
	function goTo(index: number) {
		setCurrent((index + photos.length) % photos.length)
		setTimerKey(k => k + 1)
	}

	// Auto-advance restarted whenever timerKey changes (manual nav resets it cleanly)
	useEffect(() => {
		if (photos.length <= 1) return
		const id = setTimeout(() => {
			setCurrent(prev => (prev + 1) % photos.length)
			setTimerKey(k => k + 1)
		}, SLIDE_INTERVAL_MS)
		return () => clearTimeout(id)
	}, [timerKey, photos.length])

	if (!photos.length) return <div className='size-full bg-muted' />

	const multi = photos.length > 1

	return (
		<div className='group absolute inset-0'>
			{/* ── Slides ───────────────────────────────────────────────────────── */}
			<AnimatePresence initial={false}>
				<motion.div
					key={current}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.7, ease: 'easeInOut' }}
					className='grain-overlay-10% absolute inset-0'>
					<Image
						src={photos[current].src}
						alt={photos[current].alt}
						fill
						placeholder='blur'
						blurDataURL={photos[current].blurDataURL}
						className='object-cover object-center'
						sizes='(max-width: 1024px) 100vw, 50vw'
						priority={current === 0}
						draggable={false}
					/>
				</motion.div>
			</AnimatePresence>

			{/* ── Drag layer (above slides, below controls) ────────────────────── */}
			{multi && (
				<motion.div
					className='absolute inset-0 z-10 cursor-grab active:cursor-grabbing'
					drag='x'
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.05}
					dragMomentum={false}
					onDragEnd={(_, info) => {
						if (info.offset.x < -SWIPE_THRESHOLD) goTo(current + 1)
						else if (info.offset.x > SWIPE_THRESHOLD) goTo(current - 1)
					}}
				/>
			)}

			{/* ── Arrows ───────────────────────────────────────────────────────── */}
			{multi && (
				<>
					<button
						type='button'
						onClick={() => goTo(current - 1)}
						aria-label='Poprzednie zdjęcie'
						className='absolute top-1/2 left-3 z-20 flex size-9 -translate-y-1/2 active-scale cursor-pointer items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/50'>
						<ChevronLeftIcon className='size-5' />
					</button>
					<button
						type='button'
						onClick={() => goTo(current + 1)}
						aria-label='Następne zdjęcie'
						className='absolute top-1/2 right-3 z-20 flex size-9 -translate-y-1/2 active-scale cursor-pointer items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/50'>
						<ChevronRightIcon className='size-5' />
					</button>
				</>
			)}

			{/* ── Progress indicators ──────────────────────────────────────────── */}
			{multi && (
				<div className='absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 mix-blend-difference'>
					{photos.map((_, i) => (
						<button
							key={i}
							type='button'
							onClick={() => goTo(i)}
							aria-label={`Zdjęcie ${i + 1}`}
							className='relative h-0.75 w-8 overflow-hidden rounded-full bg-white/30 backdrop-blur-md'>
							{i === current ? (
								// Active slide: animated fill that takes exactly SLIDE_INTERVAL_MS
								<motion.span
									key={timerKey}
									className='absolute inset-y-0 left-0 h-full w-full origin-left rounded-full bg-white'
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' }}
								/>
							) : (
								// Past slides: fully filled; future slides: empty
								<span
									className={cn(
										'absolute inset-0 h-full rounded-full bg-white transition-opacity',
										i < current ? 'opacity-100' : 'opacity-0'
									)}
								/>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
