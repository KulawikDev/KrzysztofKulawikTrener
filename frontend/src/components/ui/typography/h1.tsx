import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
	children: React.ReactNode
	className?: string
}

const H1 = ({ className, children }: Props) => {
	return (
		<h1
			className={cn('scroll-m-20 font-heading text-5xl !leading-none sm:text-6xl lg:text-7xl xl:text-8xl', className)}>
			{children}
		</h1>
	)
}

export default H1
