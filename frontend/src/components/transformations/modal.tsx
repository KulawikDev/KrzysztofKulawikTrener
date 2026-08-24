'use client'

import CustomPortableText from '@/components/portable-text'
import { transformationIds } from '@/components/transformations/ids'
import { CardSurface, Photo, StatRow, TransformationHeader } from '@/components/transformations/parts'
import { useScrollLock } from '@/hooks/use-scroll-block'
import { polishPlural } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import type { TransformationCardProps } from '../layout/home/transformations/client'

type Props = {
	transformation: TransformationCardProps
	layoutId: string
	onClose: () => void
}

/**
 * Expanded transformation. Header, both photos and every stat row carry the same
 * `layoutId` as their counterpart in the card, so each piece travels to its new position
 * instead of the whole panel cross-fading in.
 *
 * Nothing here declares `exit`: on close this unmounts immediately and the card left
 * behind in the stack animates back from the modal's last measured boxes. An exit
 * animation would hold the modal mounted and postpone that morph — the backdrop lives in
 * its own <AnimatePresence> in the section so it can fade out in parallel.
 */
export function TransformationModal({ transformation, layoutId, onClose }: Props) {
	const { name, age, durationMonths, imageBefore, imageAfter, stats, description } = transformation

	const ids = transformationIds(layoutId)
	const allStats = stats ?? []

	const duration =
		durationMonths === null || durationMonths === undefined
			? null
			: `${durationMonths} ${polishPlural('miesiąc', 'miesiące', 'miesięcy', durationMonths)}`

	const { lock, unlock } = useScrollLock({ autoLock: false })

	useEffect(() => {
		lock()
		return () => unlock()
	}, [lock, unlock])

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [onClose])

	return (
		<div className='pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6'>
			<motion.div
				layoutId={ids.root}
				style={{ borderRadius: 30 }}
				role='dialog'
				aria-modal='true'
				aria-label={`Transformacja: ${name}`}
				className='pointer-events-auto relative isolate max-h-[90dvh] w-full max-w-5xl overflow-x-hidden overflow-y-auto border border-white/10 p-6 shadow-2xl shadow-black/60 sm:p-8'>
				<CardSurface />

				<motion.button
					type='button'
					onClick={onClose}
					aria-label='Zamknij'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { delay: 0.2 } }}
					className='absolute top-5 right-5 z-20 flex size-10 items-center justify-center rounded-full border border-white/10 bg-background/70 text-foreground/70 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-foreground sm:top-7 sm:right-7'>
					<XIcon className='size-5' />
				</motion.button>

				<div className='relative z-10 grid gap-8 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]'>
					{/* Before / after — the detail worth showing large */}
					<div className='grid grid-cols-2 gap-3'>
						<Photo
							image={imageBefore}
							alt={imageBefore?.alt ?? `${name} przed`}
							label='Przed'
							variant='before'
							layoutId={ids.before}
							sizes='(min-width: 1024px) 235px, 45vw'
							className='w-full'
						/>
						<Photo
							image={imageAfter}
							alt={imageAfter?.alt ?? `${name} po`}
							label='Po'
							variant='after'
							layoutId={ids.after}
							sizes='(min-width: 1024px) 235px, 45vw'
							className='w-full'
						/>
					</div>

					{/* Header + every measurement */}
					<div className='flex min-w-0 flex-col gap-4'>
						<TransformationHeader name={name} age={age} duration={duration} layoutId={ids.header} className='pr-14' />

						{allStats.length > 0 && (
							<div className='flex flex-col gap-2'>
								{allStats.map(stat => (
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
					</div>
				</div>

				{/* Full story — has no counterpart on the card, so it simply fades in */}
				{description && description.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.25 } }}
						className='relative z-10 mt-8 border-t border-white/10 pt-6'>
						<CustomPortableText
							value={description as never}
							className='max-w-none text-base! leading-relaxed! text-foreground/70 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-foreground/70'
						/>
					</motion.div>
				)}
			</motion.div>
		</div>
	)
}
