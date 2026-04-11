import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
}

const H2 = ({ className, children }: Props) => {
	return (
		<h2
			className={cn(
				'scroll-m-20 font-heading text-3xl !leading-[1.25] font-medium capitalize transition-colors sm:text-[2.5rem] lg:text-5xl',
				className
			)}>
			{children}
		</h2>
	)
}

export default H2
