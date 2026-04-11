import { MorePosts } from '@/components/blog/posts'
import H2 from '@/components/ui/typography/h2'
import { cn } from '@/lib/utils'
import { MoveRightIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { MorePostsSkeleton } from '../ui/skeletons/blog-posts'

export const RecentPosts = ({
	className,
	heading = 'Najnowsze wpisy',
	description
}: {
	className?: string
	heading?: string
	description?: string
}) => {
	return (
		<section className={cn('section-padding', className)}>
			<div className='mb-12 flex flex-col gap-x-24 gap-y-2 md:flex-row md:items-end md:justify-between'>
				<H2 className='max-w-4xl text-balance'>{heading}</H2>
				{description && <p className='mt-2 w-64 text-base text-balance'>{description}</p>}
			</div>

			<Suspense fallback={<MorePostsSkeleton />}>
				<MorePosts skip='' limit={3} />
			</Suspense>

			<div className='flex justify-center'>
				<Link href='/blog' className='link mt-12 inline-flex items-center justify-center gap-2 text-sm'>
					<span className=''>Zobacz wszystkie wpisy</span>
					<MoveRightIcon className='size-4' />
				</Link>
			</div>
		</section>
	)
}
