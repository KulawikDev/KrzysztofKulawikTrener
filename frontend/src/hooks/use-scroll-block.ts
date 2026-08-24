'use client'
import { useRef, useState, useCallback } from 'react'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
type UseScrollLockOptions = {
	autoLock?: boolean
	lockTarget?: HTMLElement | string
	widthReflow?: boolean
}
type UseScrollLockReturn = {
	isLocked: boolean
	lock: () => void
	unlock: () => void
}
type OriginalStyle = {
	overflow: CSSStyleDeclaration['overflow']
	paddingRight: CSSStyleDeclaration['paddingRight']
}
const IS_SERVER = typeof window === 'undefined'

/** Whether the browser reserves the scrollbar gutter for us — see the `html` rule in globals.css. */
const supportsScrollbarGutter = () =>
	typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('scrollbar-gutter', 'stable')
export function useScrollLock(options: UseScrollLockOptions = {}): UseScrollLockReturn {
	const { autoLock = true, lockTarget, widthReflow } = options
	const [isLocked, setIsLocked] = useState(false)
	const target = useRef<HTMLElement | null>(null)
	const originalStyle = useRef<OriginalStyle | null>(null)
	const lock = useCallback(() => {
		if (target.current) {
			const { overflow, paddingRight } = target.current.style
			// Save the original styles
			originalStyle.current = { overflow, paddingRight }
			// Prevent width reflow.
			//
			// `html { scrollbar-gutter: stable }` already holds the scrollbar's width, so
			// hiding the scrollbar changes nothing and padding on top of that would shift the
			// layout by a scrollbar width in the *other* direction. Where the browser doesn't
			// support the gutter (Safari < 18.2) we fall back to padding, as before.
			if (widthReflow ?? !supportsScrollbarGutter()) {
				// Use window inner width if body is the target as global scrollbar isn't part of the document
				const offsetWidth = target.current === document.body ? window.innerWidth : target.current.offsetWidth
				// Get current computed padding right in pixels
				const currentPaddingRight = parseInt(window.getComputedStyle(target.current).paddingRight, 10) || 0
				const scrollbarWidth = offsetWidth - target.current.scrollWidth
				target.current.style.paddingRight = `${scrollbarWidth + currentPaddingRight}px`
			}
			// Lock the scroll
			target.current.style.overflow = 'hidden'
			setIsLocked(true)
		}
	}, [widthReflow])
	const unlock = useCallback(() => {
		if (target.current && originalStyle.current) {
			target.current.style.overflow = originalStyle.current.overflow
			// Unconditional: restoring the recorded value is a no-op when we never padded.
			target.current.style.paddingRight = originalStyle.current.paddingRight
		}
		setIsLocked(false)
	}, [widthReflow])
	useIsomorphicLayoutEffect(() => {
		if (IS_SERVER) return
		// Re-find the target element each time
		if (lockTarget) {
			target.current = typeof lockTarget === 'string' ? document.querySelector(lockTarget) : lockTarget
		}
		if (!target.current) {
			target.current = document.body
		}
		if (autoLock) {
			lock()
		}
		return () => {
			unlock()
		}
	}, [autoLock, lockTarget, widthReflow, lock, unlock])
	return { isLocked, lock, unlock }
}
export type { UseScrollLockOptions, UseScrollLockReturn }
