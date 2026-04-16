'use client'

import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { buttonVariants } from './button'

// Framer Motion redefines several event types (onDrag*, onAnimationStart, etc.).
// We accept standard ButtonHTMLAttributes for authoring convenience and cast
// the rest-props to `object` when spreading onto motion.button to avoid conflicts.
type ButtonEffectProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> &
	VariantProps<typeof buttonVariants>

// ─── Magnetic ─────────────────────────────────────────────────────────────────
// Button drifts toward the cursor with spring physics, snaps back on leave.
// Usage: <MagneticButton>Zacznij dziś</MagneticButton>
export function MagneticButton({ children, className, variant, size, ...props }: ButtonEffectProps) {
	const wrap = useRef<HTMLDivElement>(null)
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const sx = useSpring(x, { stiffness: 200, damping: 20 })
	const sy = useSpring(y, { stiffness: 200, damping: 20 })

	return (
		<div
			ref={wrap}
			className='inline-block'
			onMouseMove={e => {
				const r = wrap.current!.getBoundingClientRect()
				x.set((e.clientX - r.left - r.width / 2) * 0.4)
				y.set((e.clientY - r.top - r.height / 2) * 0.4)
			}}
			onMouseLeave={() => {
				x.set(0)
				y.set(0)
			}}>
			<motion.button
				whileTap={{ scale: 0.97 }}
				style={{ x: sx, y: sy }}
				className={cn(buttonVariants({ variant, size }), className)}
				{...(props as object)}>
				{children}
			</motion.button>
		</div>
	)
}

// ─── Flip ─────────────────────────────────────────────────────────────────────
// Text rotates on the X-axis to reveal a second message on hover.
// Usage: <FlipButton hoverLabel="Gotowy?">Zacznij dziś</FlipButton>
type FlipButtonProps = ButtonEffectProps & { hoverLabel: React.ReactNode }

export function FlipButton({
	children,
	hoverLabel,
	className,
	variant,
	size,
	onMouseEnter,
	onMouseLeave,
	style,
	...props
}: FlipButtonProps) {
	const [hovered, setHovered] = useState(false)

	return (
		<button
			onMouseEnter={e => {
				setHovered(true)
				onMouseEnter?.(e)
			}}
			onMouseLeave={e => {
				setHovered(false)
				onMouseLeave?.(e)
			}}
			className={cn(buttonVariants({ variant, size }), 'overflow-hidden', className)}
			style={{ perspective: '600px', ...style }}
			{...props}>
			<AnimatePresence mode='wait' initial={false}>
				<motion.span
					key={hovered ? 'b' : 'a'}
					initial={{ rotateX: hovered ? 80 : -80, opacity: 0 }}
					animate={{ rotateX: 0, opacity: 1 }}
					exit={{ rotateX: hovered ? -80 : 80, opacity: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
					style={{ display: 'block', transformOrigin: 'center center' }}>
					{hovered ? hoverLabel : children}
				</motion.span>
			</AnimatePresence>
		</button>
	)
}

// ─── Ripple ───────────────────────────────────────────────────────────────────
// Scales + glows on hover; click spawns an expanding circle from the cursor point.
// Usage: <RippleButton>Zacznij dziś</RippleButton>
type RippleData = { id: number; x: number; y: number; size: number }

export function RippleButton({
	children,
	className,
	variant,
	size,
	onMouseDown,
	scaleUpSize = 1.05,
	...props
}: ButtonEffectProps & {
	scaleUpSize?: number
}) {
	const [ripples, setRipples] = useState<RippleData[]>([])

	return (
		<motion.button
			whileHover={{ scale: scaleUpSize, boxShadow: '0 0 12px 3px rgba(255, 185, 0, 0.25)' }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: 'spring', stiffness: 300, damping: 22 }}
			onMouseDown={e => {
				const rect = e.currentTarget.getBoundingClientRect()
				const rippleSize = Math.max(rect.width, rect.height) * 2.2
				const id = performance.now()
				setRipples(p => [
					...p,
					{
						id,
						x: e.clientX - rect.left - rippleSize / 2,
						y: e.clientY - rect.top - rippleSize / 2,
						size: rippleSize
					}
				])
				setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 700)
				onMouseDown?.(e)
			}}
			className={cn(buttonVariants({ variant, size }), 'overflow-hidden', className)}
			{...(props as object)}>
			{children}
			{ripples.map(({ id, x, y, size: s }) => (
				<motion.span
					key={id}
					initial={{ scale: 0, opacity: 0.55 }}
					animate={{ scale: 1, opacity: 0 }}
					transition={{ duration: 0.65, ease: 'easeOut' }}
					className='pointer-events-none absolute rounded-full bg-white'
					style={{ left: x, top: y, width: s, height: s }}
				/>
			))}
		</motion.button>
	)
}
