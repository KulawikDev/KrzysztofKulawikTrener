'use client'

import { transformationIds } from '@/components/transformations/ids'
import { CardSurface, Photo, StatRow, TransformationHeader } from '@/components/transformations/parts'
import { portableTextToPlain } from '@/lib/transformations'
import { cn, polishPlural } from '@/lib/utils'
import { ArrowUpRightIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { TransformationCardProps } from '../layout/home/transformations/client'

/** The card has a fixed height in the scroll stack — the rest lives in the modal. */
const VISIBLE_STATS = 3

export function TransformationCard({
	layoutId,
	onOpen,
	className,
	...transformation
}: TransformationCardProps & { layoutId: string; onOpen: () => void; className?: string }) {
	const { name, age, durationMonths, imageBefore, imageAfter, stats, description } = transformation

	const ids = transformationIds(layoutId)
	const allStats = stats ?? []
	const visibleStats = allStats.slice(0, VISIBLE_STATS)
	const hiddenStatsCount = allStats.length - visibleStats.length
	const teaser = portableTextToPlain(description as never)

	const duration =
		durationMonths === null || durationMonths === undefined
			? null
			: `${durationMonths} ${polishPlural('miesiąc', 'miesiące', 'miesięcy', durationMonths)}`

	return (
		<motion.div
			layoutId={ids.root}
			style={{ borderRadius: 30 }}
			onClick={onOpen}
			role='button'
			tabIndex={0}
			aria-label={`Zobacz historię: ${name}`}
			onKeyDown={event => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					onOpen()
				}
			}}
			className={cn(
				'group relative isolate h-full cursor-pointer overflow-hidden border p-4 backdrop-blur-md lg:border-3 lg:border-primary/10',
				'shadow-[0_-6px_24px_#00000025] transition-colors hover:border-primary/20',
				'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
				className
			)}>
			<CardSurface />

			{/* lg: photos flank the details. w-54 (216px) against the card's 288px inner height
			    keeps them at the same 3:4 the modal renders, so the morph is a uniform scale. */}
			<div className='relative z-10 grid h-full grid-cols-2 gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6'>
				<Photo
					image={imageBefore}
					alt={imageBefore?.alt ?? `${name} przed`}
					label='Przed'
					variant='before'
					layoutId={ids.before}
					sizes='(min-width: 1024px) 220px, 45vw'
					className='order-1 w-full lg:h-full lg:w-54'
				/>

				<Photo
					image={imageAfter}
					alt={imageAfter?.alt ?? `${name} po`}
					label='Po'
					variant='after'
					layoutId={ids.after}
					sizes='(min-width: 1024px) 220px, 45vw'
					className='order-2 w-full lg:order-3 lg:h-full lg:w-54'
				/>

				{/* Details */}
				<div className='order-3 col-span-2 flex min-h-0 min-w-0 flex-col gap-2.5 lg:order-2 lg:col-span-1 lg:py-1'>
					<TransformationHeader name={name} age={age} duration={duration} layoutId={ids.header} />

					{visibleStats.length > 0 && (
						<div className='flex flex-col gap-2'>
							{visibleStats.map(stat => (
								<StatRow
									key={stat._key}
									layoutId={ids.stat(stat._key)}
									label={stat.label}
									before={stat.before}
									after={stat.after}
								/>
							))}
						</div>
					)}

					{teaser && <p className='line-clamp-2 font-body text-sm leading-relaxed text-foreground/50'>{teaser}</p>}

					<div className='mt-auto flex items-center justify-between gap-4 pt-1'>
						<span className='flex items-center gap-2 font-heading text-lg leading-none text-primary uppercase transition-colors group-hover:text-primary md:text-xl'>
							Zobacz historię
							<ArrowUpRightIcon className='size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:size-6' />
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
