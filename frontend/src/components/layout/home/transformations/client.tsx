'use client'

import { TransformationCard } from '@/components/transformations/card'
import { TransformationModal } from '@/components/transformations/modal'
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { TransformationsQueryResult } from '~/sanity.types'

export type TransformationCardProps = TransformationsQueryResult[number]

/** The card the modal was opened from — needed so `layoutId` matches the right variant. */
type Selection = { data: TransformationCardProps; layoutId: string }

type AnimatedCardProps = {
	scrollYProgress: MotionValue<number>
	index: number
	total: number
	data: TransformationCardProps
	onOpen: (selection: Selection) => void
}

/**
 * Cards are deliberately not rotated. Framer measures a shared element with
 * `getBoundingClientRect()`, which reports the axis-aligned bounding box — a rotated
 * ancestor therefore hands the modal a start box several percent too tall and the morph
 * lands visibly wrong. Depth comes from the scroll-driven stacking instead.
 */
function AnimatedCard({ scrollYProgress, index, total, data, onOpen }: AnimatedCardProps) {
	const slotStart = index / total
	const animEnd = slotStart + (1 / total) * 0.6

	const y = useTransform(scrollYProgress, [slotStart, animEnd], ['100vh', '-20vh'])
	const springY = useSpring(y, { stiffness: 50, damping: 20 })

	const layoutId = `transformation-desktop-${data._id}`

	return (
		<motion.div className='absolute inset-0' style={{ y: springY, zIndex: index }}>
			<TransformationCard {...data} layoutId={layoutId} onOpen={() => onOpen({ data, layoutId })} />
		</motion.div>
	)
}

const HEADING = (
	<h2 className='shrink-0 text-right font-heading text-[clamp(40px,13vw,188px)] leading-[0.9] text-foreground uppercase'>
		Zobacz jak inne
		<br />
		kobiety odmieniły swoje życie
	</h2>
)

export function TransformationsSection({ transformations }: { transformations: TransformationCardProps[] }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [selected, setSelected] = useState<Selection | null>(null)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => setIsMounted(true), [])

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end']
	})

	const total = transformations.length

	return (
		<>
			{/* ── Up to lg: simple vertical stack ──────────────────────────────── */}
			<div className='flex flex-col gap-6 px-4 py-12 sm:px-6 lg:hidden'>
				{HEADING}
				<div className='mx-auto flex w-full max-w-2xl flex-col gap-4'>
					{transformations.map(t => {
						const layoutId = `transformation-mobile-${t._id}`

						return (
							<TransformationCard
								key={t._id}
								{...t}
								layoutId={layoutId}
								onOpen={() => setSelected({ data: t, layoutId })}
							/>
						)
					})}
				</div>
			</div>

			{/* ── lg+: scroll-driven stacked animation ─────────────────────────── */}
			<div ref={containerRef} className='relative hidden lg:block' style={{ height: `${(total + 1) * 100}vh` }}>
				<div className='sticky top-0 flex h-dvh flex-col overflow-hidden py-12'>
					{HEADING}
					<div className='relative flex flex-1 items-center justify-center px-6'>
						<div className='relative h-80 w-full max-w-240'>
							{transformations.map((t, i) => (
								<AnimatedCard
									key={t._id}
									scrollYProgress={scrollYProgress}
									index={i}
									total={total}
									data={t}
									onOpen={setSelected}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			{/*
			  Portalled to <body>: the section sits inside <main class="overflow-x-clip">, and
			  the sticky stack clips its own overflow, so a modal rendered in place is at the
			  mercy of those ancestors' stacking and clipping. Framer's projection is unaffected
			  — this renders from the section root, which has no motion ancestors either way.
			*/}
			{isMounted &&
				createPortal(
					<>
						{/* Backdrop is its own presence group so it can fade out while the card morphs back. */}
						<AnimatePresence>
							{selected && (
								<motion.div
									key='transformation-backdrop'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									onClick={() => setSelected(null)}
									className='fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm'
								/>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{selected && (
								<TransformationModal
									key={selected.layoutId}
									transformation={selected.data}
									layoutId={selected.layoutId}
									onClose={() => setSelected(null)}
								/>
							)}
						</AnimatePresence>
					</>,
					document.body
				)}
		</>
	)
}
