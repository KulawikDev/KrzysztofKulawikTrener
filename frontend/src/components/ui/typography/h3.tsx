import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
}

const H3 = ({ className, children }: Props) => {
	return (
		<h3
			className={cn(
				'scroll-m-20 font-heading text-lg leading-tight font-medium text-balance md:text-xl lg:text-2xl',
				className
			)}>
			{children}
		</h3>
	)
}

export default H3
