'use client'

import { cn } from '@/lib/utils'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type PropsWithChildren
} from 'react'

type CarouselCtx = {
	viewportRef: (node: HTMLElement | null) => void
	embla: UseEmblaCarouselType | undefined

	canScrollPrev: boolean
	canScrollNext: boolean
	selectedIndex: number
	scrollSnaps: number[]

	scrollPrev: () => void
	scrollNext: () => void
	scrollTo: (index: number) => void

	// cursor follower
	containerRef: React.RefObject<HTMLDivElement | null>
	isHovering: boolean
	setIsHovering: (v: boolean) => void
}

const CarouselContext = createContext<CarouselCtx | null>(null)

export function useCarousel() {
	const ctx = useContext(CarouselContext)
	if (!ctx) throw new Error('useCarousel must be used within <CarouselProvider />')
	return ctx
}

type CarouselProviderProps = PropsWithChildren<{
	options?: EmblaOptionsType
	className?: string

	// Cursor follower (opt-in)
	withCursorFollower?: boolean
	cursorFollowerClassName?: string
}>

export function CarouselProvider({
	options,
	className,
	children,
	withCursorFollower = false,
	cursorFollowerClassName
}: CarouselProviderProps) {
	const [viewportRef, embla] = useEmblaCarousel(
		options ?? {
			align: 'start',
			loop: false,
			skipSnaps: false,
			dragFree: true
		}
	)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(true)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

	const containerRef = useRef<HTMLDivElement | null>(null)
	const [isHovering, setIsHovering] = useState(false)

	const onSelect = useCallback(() => {
		if (!embla) return
		setSelectedIndex(embla.selectedScrollSnap())
		setCanScrollPrev(embla.canScrollPrev())
		setCanScrollNext(embla.canScrollNext())
	}, [embla])

	useEffect(() => {
		if (!embla) return

		setScrollSnaps(embla.scrollSnapList())
		onSelect()

		embla.on('select', onSelect)
		embla.on('reInit', () => {
			setScrollSnaps(embla.scrollSnapList())
			onSelect()
		})

		return () => {
			embla.off('select', onSelect)
			embla.off('reInit', onSelect)
		}
	}, [embla, onSelect])

	const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla])
	const scrollNext = useCallback(() => embla?.scrollNext(), [embla])
	const scrollTo = useCallback((index: number) => embla?.scrollTo(index), [embla])

	const value = useMemo<CarouselCtx>(
		() => ({
			viewportRef,
			// @ts-ignore
			embla,
			canScrollPrev,
			canScrollNext,
			selectedIndex,
			scrollSnaps,
			scrollPrev,
			scrollNext,
			scrollTo,
			containerRef,
			isHovering,
			setIsHovering
		}),
		[
			viewportRef,
			embla,
			canScrollPrev,
			canScrollNext,
			selectedIndex,
			scrollSnaps,
			scrollPrev,
			scrollNext,
			scrollTo,
			isHovering
		]
	)

	return (
		<CarouselContext.Provider value={value}>
			<div ref={containerRef} className={cn('group/carousel relative overflow-x-clip', className)}>
				{withCursorFollower ? (
					<CursorFollower containerRef={containerRef} isHovering={isHovering} className={cursorFollowerClassName} />
				) : null}

				{children}
			</div>
		</CarouselContext.Provider>
	)
}

export function CarouselViewport({ className, children }: PropsWithChildren<{ className?: string }>) {
	const { viewportRef, setIsHovering } = useCarousel()
	return (
		<div
			className={cn('overflow-hidden', className)}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			ref={viewportRef}>
			{children}
		</div>
	)
}

export function CarouselContainer({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <div className={cn('flex', className)}>{children}</div>
}

// ---------- Cursor follower + throttle (kept client-side inside carousel module) ----------

function CursorFollower({
	containerRef,
	isHovering,
	className
}: {
	containerRef: React.RefObject<HTMLDivElement | null>
	isHovering: boolean
	className?: string
}) {
	const cursorX = useMotionValue(-100)
	const cursorY = useMotionValue(-100)
	const [isPressed, setIsPressed] = useState(false)

	const springConfig = { damping: 25, stiffness: 300 }
	const cursorXSpring = useSpring(cursorX, springConfig)
	const cursorYSpring = useSpring(cursorY, springConfig)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect()
			cursorX.set(e.clientX - rect.left)
			cursorY.set(e.clientY - rect.top)
		}

		const onDown = () => setIsPressed(true)
		const onUp = () => setIsPressed(false)

		const throttledMouseMove = throttle(handleMouseMove, 16)
		container.addEventListener('mousemove', throttledMouseMove)
		container.addEventListener('mousedown', onDown)
		container.addEventListener('mouseup', onUp)
		container.addEventListener('mouseleave', onUp)
		return () => {
			container.removeEventListener('mousemove', throttledMouseMove)
			container.removeEventListener('mousedown', onDown)
			container.removeEventListener('mouseup', onUp)
			container.removeEventListener('mouseleave', onUp)
		}
	}, [containerRef, cursorX, cursorY])

	return (
		<AnimatePresence>
			{isHovering && (
				<motion.div
					className={cn('pointer-events-none absolute z-50 hidden items-center justify-center lg:flex', className)}
					style={{
						x: cursorXSpring,
						y: cursorYSpring,
						translateX: '-50%',
						translateY: '-50%'
					}}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: isPressed ? 0.9 : 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					transition={{ duration: 0.2, ease: 'backOut' }}>
					{/* Left chevron */}
					<motion.svg
						width='9'
						height='14'
						viewBox='0 0 9 14'
						fill='none'
						stroke='white'
						strokeWidth='2.5'
						strokeLinecap='round'
						strokeLinejoin='round'
						animate={{ x: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
						transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
						<path d='M7 1 1.5 7 7 13' />
					</motion.svg>

					{/* Center circle */}
					<motion.div
						className='mx-2.5 size-10 rounded-full border-2 border-white'
						animate={{ scale: [0.98, 1.02, 0.98] }}
						transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
					/>

					{/* Right chevron */}
					<motion.svg
						width='9'
						height='14'
						viewBox='0 0 9 14'
						fill='none'
						stroke='white'
						strokeWidth='2.5'
						strokeLinecap='round'
						strokeLinejoin='round'
						animate={{ x: [0, 3, 0], opacity: [0.6, 1, 0.6] }}
						transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
						<path d='M2 1l5.5 6L2 13' />
					</motion.svg>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

function throttle<T extends (...args: any[]) => void>(func: T, limit: number) {
	let lastFunc: NodeJS.Timeout
	let lastRan: number | undefined

	return function (this: any, ...args: Parameters<T>) {
		const context = this
		if (!lastRan) {
			func.apply(context, args)
			lastRan = Date.now()
		} else {
			clearTimeout(lastFunc)
			lastFunc = setTimeout(
				() => {
					if (Date.now() - (lastRan as number) >= limit) {
						func.apply(context, args)
						lastRan = Date.now()
					}
				},
				limit - (Date.now() - (lastRan as number))
			)
		}
	}
}
