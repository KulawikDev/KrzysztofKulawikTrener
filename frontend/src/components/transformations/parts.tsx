'use client'

import { getStatDelta } from '@/lib/transformations'
import { cn } from '@/lib/utils'
import { urlForImage } from '@/sanity/lib/utils'
import { ArrowRightIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'

/**
 * Card and modal deliberately share these primitives at *identical* sizes.
 *
 * Every one of them carries a `layoutId` across the card → modal transition, and Framer
 * morphs a shared element by transforming its box. Any difference in font size or padding
 * between the two would therefore be animated as a scale — visibly squashing the text
 * mid-flight. Only the arrangement changes between card and modal; the pieces do not.
 */

/** Gradient + grain background shared by the card and the modal. */
export const CardSurface = () => (
	<div aria-hidden='true' className='pointer-events-none absolute inset-0 size-full'>
		<div
			className='absolute inset-0 size-full'
			style={{ background: 'linear-gradient(124.6deg, #161616 11.7%, #1f1f1f 88.3%)' }}
		/>
		<div
			className='absolute inset-0 size-full opacity-25'
			style={{
				backgroundImage: "url('/images/decoration/grain.webp')",
				backgroundSize: '150px',
				backgroundPosition: 'top left'
			}}
		/>
	</div>
)

// ── Photo ─────────────────────────────────────────────────────────────────────

type PhotoProps = {
	image: unknown
	alt: string
	label: string
	variant: 'before' | 'after'
	layoutId: string
	sizes?: string
	className?: string
}

/**
 * Both card and modal render this at a 3:4 ratio, so the morph between them is a uniform
 * scale — an `object-cover` image survives that without distorting.
 */
export const Photo = ({ image, alt, label, variant, layoutId, sizes, className }: PhotoProps) => {
	const url = urlForImage(image)?.width(700).height(933).fit('crop').url()
	const isAfter = variant === 'after'

	return (
		<motion.div
			layoutId={layoutId}
			style={{ borderRadius: 18 }}
			className={cn(
				'relative aspect-3/4 overflow-hidden',
				isAfter ? 'border border-primary/40' : 'border border-white/10',
				className
			)}>
			{url ? (
				<Image src={url} alt={alt} fill sizes={sizes} className='object-cover' draggable={false} />
			) : (
				<div className='size-full bg-secondary' />
			)}

			<span
				className={cn(
					'absolute bottom-2.5 left-2.5 rounded-lg px-2.5 py-1.5 font-heading text-sm leading-none uppercase',
					isAfter ? 'bg-primary text-primary-foreground' : 'bg-background/85 text-foreground backdrop-blur-sm'
				)}>
				{label}
			</span>
		</motion.div>
	)
}

// ── Stat row ──────────────────────────────────────────────────────────────────

type StatRowProps = {
	label: string | null
	before: string | null
	after: string | null
	layoutId?: string
}

/**
 * One measurement, read left to right: what was measured, where it started, where it
 * landed, and the change.
 */
export const StatRow = ({ label, before, after, layoutId }: StatRowProps) => {
	const delta = getStatDelta(before, after)

	return (
		<motion.div
			layoutId={layoutId}
			style={{ borderRadius: 14 }}
			className='flex items-center gap-4 border border-white/5 bg-white/3 py-2 pr-2 pl-3.5'>
			<span className='min-w-0 flex-1 truncate font-heading text-xl leading-none text-foreground/70 uppercase'>
				{label}
			</span>

			<span className='flex shrink-0 items-center gap-2.5 font-heading text-xl leading-none whitespace-nowrap'>
				<span className='text-foreground/30 line-through'>{before}</span>
				<ArrowRightIcon className='size-4 text-primary' />
				<span className='text-foreground'>{after}</span>
			</span>

			{delta && (
				<span className='shrink-0 rounded-md border border-primary/25 bg-primary/10 p-1.5 font-heading text-sm leading-none whitespace-nowrap text-primary'>
					{delta}
				</span>
			)}
		</motion.div>
	)
}

// ── Header ────────────────────────────────────────────────────────────────────

export const Chip = ({ children, className }: { children: React.ReactNode; className?: string }) => (
	<span
		className={cn(
			'rounded-full border border-white/12 bg-white/5 px-3 py-1.5 font-heading text-sm leading-none text-foreground/70 uppercase',
			className
		)}>
		{children}
	</span>
)

type HeaderProps = {
	name: string | null
	age: number | null
	duration: string | null
	layoutId: string
	className?: string
}

export const TransformationHeader = ({ name, age, duration, layoutId, className }: HeaderProps) => (
	<motion.div layoutId={layoutId} className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
		<h3 className='font-heading text-4xl leading-none text-foreground uppercase'>{name}</h3>
		{age !== null && age !== undefined && <Chip>{age} lat</Chip>}
		{duration && <Chip className='border-primary/25 bg-primary/10 text-primary'>{duration}</Chip>}
	</motion.div>
)
