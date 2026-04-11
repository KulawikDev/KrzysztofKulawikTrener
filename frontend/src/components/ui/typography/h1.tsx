import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
	children: React.ReactNode
	className?: string
}

const H1 = ({ className, children }: Props) => {
	return (
		<h1
			className={cn(
				'scroll-m-20 font-heading text-4xl !leading-none font-semibold sm:text-5xl lg:text-6xl xl:text-7xl',
				className
			)}>
			{children}
		</h1>
	)
}

export default H1
