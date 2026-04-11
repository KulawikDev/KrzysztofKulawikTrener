import CoverImage from '@/components/cover-image'
import PortableText from '@/components/portable-text'
import { MorePosts } from '@/components/blog/posts'
import { StructuredData } from '@/components/structured-data'
import H1 from '@/components/ui/typography/h1'
import H2 from '@/components/ui/typography/h2'
import { siteConfig } from '@/config/site'
import { generateBlogPostStructuredData } from '@/lib/structuredData'
import type { Metadata, ResolvingMetadata } from 'next'
import { type PortableTextBlock } from 'next-sanity'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { sanityFetch } from '@/sanity/lib/live'
import { postPagesSlugs, postQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'

type Props = {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const { data } = await sanityFetch({
		query: postPagesSlugs,
		perspective: 'published',
		stega: false
	})
	return data
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const params = await props.params
	const { data: post } = await sanityFetch({
		query: postQuery,
		params,
		stega: false
	})
	const previousImages = (await parent).openGraph?.images || []
	const ogImage = resolveOpenGraphImage(post?.coverImage)

	return {
		authors: [{ name: siteConfig.name }],
		title: post?.title,
		description: post?.excerpt,
		openGraph: {
			images: ogImage ? [ogImage, ...previousImages] : previousImages
		}
	} satisfies Metadata
}

export default async function PostPage(props: Props) {
	const params = await props.params
	const [{ data: post }] = await Promise.all([sanityFetch({ query: postQuery, params })])

	if (!post?._id) {
		return notFound()
	}

	return (
		<div className='grid-container pt-20'>
			<StructuredData data={generateBlogPostStructuredData(post)} />
			<main className=''>
				<div className='my-12 grid gap-12 lg:my-16'>
					<div>
						<div className='mb-6 grid gap-6 border-b pb-6'>
							<H1 className='max-w-full text-pretty xl:text-6xl'>{post.title}</H1>
						</div>

						<article className='grid max-w-4xl gap-6'>
							<div className=''>
								<CoverImage image={post.coverImage} priority />
							</div>

							{post.content?.length && (
								<PortableText className='max-w-2xl' value={post.content as PortableTextBlock[]} />
							)}
						</article>
					</div>
				</div>
			</main>
			<aside className='border-t'>
				<div className='my-12 grid gap-8 lg:my-16'>
					<H2>Polecamy również</H2>
					<aside>
						<Suspense>{await MorePosts({ skip: post._id, limit: 3 })}</Suspense>
					</aside>
				</div>
			</aside>
		</div>
	)
}
