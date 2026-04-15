import { PlaceholderImage } from '@/components/ui/skeletons/placeholder-image'
import H2 from '@/components/ui/typography/h2'
import { sanityFetch } from '@/sanity/lib/live'
import { morePostsQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/utils'
import { MoveRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Post as PostType } from '../../../sanity.types'
import DateComponent from '../date'
import H3 from '../ui/typography/h3'

export const Post = ({ post }: { post: PostType }) => {
	const { _id, title, slug, coverImage, excerpt } = post

	return (
		<article key={_id} className='group relative z-0 flex h-full flex-col'>
			<Link href={`/blog/${slug}`}>
				<div className='relative -z-10 mb-3 block aspect-[4/3] h-auto w-full overflow-hidden rounded-2xl'>
					{coverImage?.asset?._ref ? (
						<Image
							className='pointer-events-none size-full object-cover duration-300 select-none group-hover:scale-105'
							width={700}
							height={600}
							alt={coverImage?.alt || ''}
							src={urlForImage(coverImage)?.height(600).width(700).url() as string}
						/>
					) : (
						<PlaceholderImage className='size-full' />
					)}
					<div>
						{post.date && (
							<div className='absolute top-3 left-3 z-10 rounded-lg bg-background px-2 py-1 text-xs leading-normal text-foreground shadow-lg'>
								<DateComponent dateString={post.date} />
							</div>
						)}
						<div className='absolute top-3 right-3 -translate-x-4 rounded-full bg-white px-4 py-0.5 text-black opacity-0 shadow-lg duration-300 group-hover:translate-x-0 group-hover:opacity-100'>
							<MoveRightIcon className='size-6' />
						</div>
					</div>
				</div>
				<H3 className='mb-2 line-clamp-2 text-balance'>{title}</H3>
				{excerpt && <p className='line-clamp-2 text-sm leading-relaxed text-pretty text-foreground/75'>{excerpt}</p>}
			</Link>
		</article>
	)
}

export const PostsGrid = ({
	children,
	heading,
	subHeading
}: {
	children: React.ReactNode
	heading?: string
	subHeading?: string
}) => (
	<div className='relative'>
		{heading && <H2 className=''>{heading}</H2>}
		{subHeading && <p className='mt-2 text-lg leading-8 text-muted-foreground'>{subHeading}</p>}
		<div className='mt-6 grid grid-cols-1 gap-4 gap-y-8 border-border md:grid-cols-2 lg:grid-cols-3'>{children}</div>
	</div>
)

export const MorePosts = async ({ skip, limit, heading }: { skip: string; limit: number; heading?: string }) => {
	const { data } = await sanityFetch({
		query: morePostsQuery,
		params: { skip, limit }
	})

	if (!data || data.length === 0) {
		return null
	}

	return (
		<PostsGrid heading={heading}>
			{data?.map((post: any, i) => (
				<Post key={post._id} post={post} />
			))}
		</PostsGrid>
	)
}
