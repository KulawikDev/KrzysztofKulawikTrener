import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
	type?: 'ul' | 'ol'
}

const List = ({ className, children, type = 'ul' }: Props) => {
	return type === 'ul' ? (
		<ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>
	) : (
		<ol className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', className)}>{children}</ol>
	)
}

export default List
