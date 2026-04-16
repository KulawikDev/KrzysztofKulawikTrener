'use client'

import { TransformationCard } from '@/components/transformations/card'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { TransformationsQueryResult } from '~/sanity.types'

// Rotations from the Figma design
const ROTATIONS = [2, -2.75, 3.4, -6]

export type TransformationCardProps = TransformationsQueryResult[number]

type AnimatedCardProps = {
	scrollYProgress: MotionValue<number>
	index: number
	total: number
	rotation: number
	data: TransformationCardProps
}

function AnimatedCard({ scrollYProgress, index, total, rotation, data }: AnimatedCardProps) {
	const slotStart = index / total
	const animEnd = slotStart + (1 / total) * 0.6

	const y = useTransform(scrollYProgress, [slotStart, animEnd], ['100vh', '-20vh'])
	const springY = useSpring(y, { stiffness: 50, damping: 20 })

	return (
		<motion.div className='absolute inset-0' style={{ y: springY, rotate: rotation, zIndex: index }}>
			<TransformationCard {...data} />
		</motion.div>
	)
}

const HEADING = (
	<h2 className='shrink-0 text-right font-heading text-[clamp(40px,13vw,188px)] leading-[0.9] text-foreground uppercase'>
		Zobacz jak inni
		<br />
		odmienili swoje życie
	</h2>
)

export function TransformationsSection({ transformations }: { transformations: TransformationCardProps[] }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end']
	})

	const total = transformations.length

	return (
		<>
			{/* ── Mobile: simple vertical stack ────────────────────────────────── */}
			<div className='flex flex-col gap-6 px-4 py-12 sm:px-6 md:hidden'>
				{HEADING}
				<div className='flex flex-col gap-4'>
					{transformations.map(t => (
						<TransformationCard key={t._id} {...t} />
					))}
				</div>
			</div>

			{/* ── md+: scroll-driven stacked animation ─────────────────────────── */}
			<div ref={containerRef} className='relative hidden md:block' style={{ height: `${(total + 1) * 100}vh` }}>
				<div className='sticky top-0 flex h-dvh flex-col overflow-hidden py-12 lg:py-20 xl:py-24'>
					{HEADING}
					<div className='relative flex flex-1 items-center justify-center'>
						<div className='relative h-80 w-full max-w-220'>
							{transformations.map((t, i) => (
								<AnimatedCard
									key={t._id}
									scrollYProgress={scrollYProgress}
									index={i}
									total={total}
									rotation={ROTATIONS[i % ROTATIONS.length]}
									data={t}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
