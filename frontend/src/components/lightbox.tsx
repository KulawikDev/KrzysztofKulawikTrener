'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LightboxItem = {
	/** Anything you want to render inside the lightbox slide */
	content: ReactNode
	/** Smaller node rendered in the thumbnail strip (falls back to content) */
	thumbnail?: ReactNode
	/** Optional label shown in the caption bar */
	label?: string | null
	/** Optional description / alt shown below the label */
	description?: string | null
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type LightboxContextValue = {
	items: LightboxItem[]
	open: boolean
	index: number
	openAt: (i: number) => void
	close: () => void
	prev: () => void
	next: () => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox() {
	const ctx = useContext(LightboxContext)
	if (!ctx) throw new Error('useLightbox must be used inside <Lightbox>')
	return ctx
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function Lightbox({
	items,
	children,
	defaultIndex = 0
}: {
	items: LightboxItem[]
	children: ReactNode
	defaultIndex?: number
}) {
	const [open, setOpen] = useState(false)
	const [index, setIndex] = useState(defaultIndex)

	const clamp = useCallback((i: number) => (i + items.length) % items.length, [items.length])

	const openAt = useCallback(
		(i: number) => {
			setIndex(clamp(i))
			setOpen(true)
		},
		[clamp]
	)

	const close = useCallback(() => setOpen(false), [])
	const prev = useCallback(() => setIndex(p => clamp(p - 1)), [clamp])
	const next = useCallback(() => setIndex(p => clamp(p + 1)), [clamp])

	// Keyboard navigation
	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') prev()
			if (e.key === 'ArrowRight') next()
			if (e.key === 'Escape') close()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open, prev, next, close])

	return (
		<LightboxContext.Provider value={{ items, open, index, openAt, close, prev, next }}>
			{children}
			<LightboxModal />
		</LightboxContext.Provider>
	)
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

/**
 * Wrap any element with <LightboxTrigger index={i}> to open the lightbox at
 * that index on click. The child is rendered as-is; a transparent button
 * overlay handles the interaction.
 */
export function LightboxTrigger({
	index,
	children,
	className
}: {
	index: number
	children: ReactNode
	className?: string
}) {
	const { openAt } = useLightbox()
	return (
		<button type='button' onClick={() => openAt(index)} className={cn('cursor-zoom-in', className)}>
			{children}
		</button>
	)
}

// ---------------------------------------------------------------------------
// Modal (internal)
// ---------------------------------------------------------------------------

const SWIPE_THRESHOLD = 60 // px
const DRAG_VELOCITY_THRESHOLD = 300 // px/s

function LightboxModal() {
	const { items, open, index, openAt, close, prev, next } = useLightbox()
	const current = items[index]

	// Direction ref so AnimatePresence can animate correctly
	const directionRef = useRef<1 | -1>(1)

	// Ref scoped to the slide area only (not the thumbnail strip)
	const slideAreaRef = useRef<HTMLDivElement>(null)

	// Pause + reset every <video> in the slide area when the active slide
	// changes OR the lightbox closes. The exiting motion.div is still in the
	// DOM during its exit animation, so this fires at exactly the right time.
	useEffect(() => {
		slideAreaRef.current?.querySelectorAll('video').forEach(v => {
			v.pause()
			v.currentTime = 0
		})
	}, [index, open])

	const handlePrev = () => {
		directionRef.current = -1
		prev()
	}

	const handleNext = () => {
		directionRef.current = 1
		next()
	}

	const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
		const { offset, velocity } = info
		if (offset.x < -SWIPE_THRESHOLD || velocity.x < -DRAG_VELOCITY_THRESHOLD) {
			handleNext()
		} else if (offset.x > SWIPE_THRESHOLD || velocity.x > DRAG_VELOCITY_THRESHOLD) {
			handlePrev()
		}
	}

	const slideVariants = {
		enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
		center: { opacity: 1, x: 0 },
		exit: (dir: number) => ({ opacity: 0, x: dir * -40 })
	}

	if (!current) return null

	return (
		<Dialog open={open} onOpenChange={v => !v && close()}>
			<DialogContent className='z-60 max-w-7xl overflow-hidden border-border/5 p-0 max-md:h-full [&>button]:hidden'>
				<DialogTitle className='sr-only'>Lightbox</DialogTitle>
				<DialogDescription className='sr-only'>
					Użyj strzałek, aby przejść do poprzedniego lub następnego elementu. Naciśnij Escape, aby zamknąć.
				</DialogDescription>

				<div className='relative flex min-w-0 flex-col bg-black'>
					{/* Close */}
					<Button
						variant='ghost'
						size='icon'
						className='absolute top-3 right-3 z-30 text-white hover:bg-white/10'
						onClick={close}>
						<XIcon className='size-5' />
					</Button>

					{/* Main slide area — ref keeps querySelectorAll scoped away from the thumbnail strip */}
					<div
						ref={slideAreaRef}
						className='relative aspect-9/16 overflow-hidden select-none max-md:grow md:aspect-video'>
						<AnimatePresence mode='wait' custom={directionRef.current}>
							<motion.div
								key={index}
								custom={directionRef.current}
								variants={slideVariants}
								initial='enter'
								animate='center'
								exit='exit'
								transition={{ duration: 0.2, ease: 'easeInOut' }}
								drag='x'
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0.15}
								onDragEnd={handleDragEnd}
								className='absolute inset-0 flex items-center justify-center'>
								{current.content}
							</motion.div>
						</AnimatePresence>

						{/* Prev / Next */}
						<Button
							variant='ghost'
							size='icon'
							className='absolute top-1/2 left-2 z-20 -translate-y-1/2 text-white hover:bg-white/10'
							onClick={handlePrev}>
							<ChevronLeftIcon className='size-6' />
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='absolute top-1/2 right-2 z-20 -translate-y-1/2 text-white hover:bg-white/10'
							onClick={handleNext}>
							<ChevronRightIcon className='size-6' />
						</Button>

						{/* Caption */}
						<div className='absolute right-0 bottom-0 left-0 z-10 p-4'>
							<div className='flex items-center justify-between gap-4'>
								<p className='text-xs text-white/60'>
									{index + 1} / {items.length}
								</p>
								<div className='min-w-0 text-right'>
									{current.label ? <p className='text-xs text-white/90'>{current.label}</p> : null}
									{current.description ? (
										<p className='line-clamp-1 text-xs text-white/60'>{current.description}</p>
									) : null}
								</div>
							</div>
						</div>
					</div>

					{/* Thumbnail strip */}
					<div className='border-t border-white/10 bg-black/60 p-3 backdrop-blur'>
						<div className='flex gap-2 overflow-x-auto'>
							{items.map((item, i) => (
								<button
									key={i}
									type='button'
									onClick={() => {
										directionRef.current = i > index ? 1 : -1
										openAt(i)
									}}
									className={cn(
										'relative size-16 shrink-0 overflow-hidden rounded-md border transition-opacity',
										i === index
											? 'border-primary opacity-100'
											: 'active-scale border-border opacity-70 hover:opacity-100'
									)}>
									{/* render thumbnail if provided, else fall back to full content */}
									<div className='pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden'>
										{item.thumbnail ?? item.content}
									</div>
								</button>
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
