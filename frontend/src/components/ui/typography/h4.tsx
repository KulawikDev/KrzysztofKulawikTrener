import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
}

const H4 = ({ className, children }: Props) => {
	return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>{children}</h4>
}

export default H4
