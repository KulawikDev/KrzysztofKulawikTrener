import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

type Props = {
	className?: string
	label?: string
	iconClassName?: string
	as?: 'div' | 'span' | 'li'
}

export const PlaceholderImage = ({ className, iconClassName, label, as = 'div' }: Props) => {
	const Component = as

	return (
		<Component
			className={cn(
				'group/placeholderImage flex aspect-square size-full items-center justify-center overflow-hidden rounded-xl border bg-muted shadow-sm',
				className
			)}>
			<ImageIcon className={cn('size-6 text-muted-foreground', iconClassName)} />
			{label && <span className='sr-only'>{label}</span>}
		</Component>
	)
}
