'use client'

import { useEffect, useState } from 'react'

export const useScrollPosition = () => {
	const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const updatePosition = () => {
			setScrollPosition({ y: window.scrollY, x: window.scrollX })
		}

		window.addEventListener('scroll', updatePosition)

		updatePosition()

		return () => window.removeEventListener('scroll', updatePosition)
	}, [])

	return scrollPosition
}
