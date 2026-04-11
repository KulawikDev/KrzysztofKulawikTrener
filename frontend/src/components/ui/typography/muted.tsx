import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
}

const Muted = ({ className, children }: Props) => {
	return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export default Muted
