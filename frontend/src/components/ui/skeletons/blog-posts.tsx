import { PlaceholderImage } from '@/components/ui/skeletons/placeholder-image'
import React from 'react'
import { Skeleton } from '../skeleton'
import { PostsGrid } from '@/components/blog/posts'

type Props = {}

export const PostCardSkeleton = (props: Props) => {
	return (
		<div className='flex h-full flex-col overflow-hidden rounded-xl bg-secondary p-3'>
			<div className='-z-10 mb-4 block aspect-[4/3] h-auto w-full overflow-hidden rounded-md'>
				<PlaceholderImage className='size-full bg-background' />
			</div>

			<div className='mb-2 text-sm'>
				<Skeleton className='h-4 w-24' />
			</div>

			<div className='mb-2 space-y-1'>
				<Skeleton className='h-5 w-full' />
				<Skeleton className='h-5 w-[60%]' />
			</div>
			<div className='space-y-1'>
				<Skeleton className='h-3 w-[80%]' />
				<Skeleton className='h-3 w-[40%]' />
			</div>
		</div>
	)
}

export const MorePostsSkeleton = () => {
	return (
		<PostsGrid>
			<PostCardSkeleton />
			<PostCardSkeleton />
			<PostCardSkeleton />
		</PostsGrid>
	)
}
