import { MorePosts, MorePostsSection } from '@/components/blog/posts'
import { Lightbox, LightboxTrigger } from '@/components/lightbox'
import PortableText from '@/components/portable-text'
import { SanityImage } from '@/components/sanity-image'
import { StructuredData } from '@/components/structured-data'
import H1 from '@/components/ui/typography/h1'
import H2 from '@/components/ui/typography/h2'
import H3 from '@/components/ui/typography/h3'
import { siteConfig } from '@/config/site'
import { generateBlogPostStructuredData } from '@/lib/structuredData'
import { cn } from '@/lib/utils'
import { sanityFetch } from '@/sanity/lib/live'
import { postPagesSlugs, postQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import { ChevronRight } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'
import { type PortableTextBlock } from 'next-sanity'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import slugify from 'slugify'

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

	const headings = getHeadingsFromPortableText(post.content)

	const galleryItems =
		post.gallery?.map((img: any) => ({
			content: (
				<SanityImage
					image={img}
					alt={(img as any).alt || ''}
					sizes='(min-width: 1024px) 1200px, 100vw'
					className='max-h-full max-w-full object-contain'
				/>
			),
			thumbnail: (
				<SanityImage image={img} alt={(img as any).alt || ''} sizes='64px' className='size-full object-cover' />
			),
			label: (img as any).caption ?? null
		})) ?? []

	return (
		<div className='grid-container pt-20'>
			<StructuredData data={generateBlogPostStructuredData(post)} />
			<main className=''>
				<header className='relative grid-container container-fill pt-32'>
					<div className='mb-6 grid gap-6 pb-6'>
						<H1 className='max-w-full font-heading text-5xl leading-tight font-normal text-pretty uppercase transition-colors sm:text-6xl md:text-7xl lg:text-8xl'>
							{post.title}
						</H1>
						{post.tags && post.tags.length > 0 && (
							<div className='flex flex-wrap gap-2'>
								{post.tags.map((tag: string) => (
									<span key={tag} className='rounded-full border border-border/50 px-3 py-1 text-xs text-foreground/60'>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
					<div className='aspect-4/3 overflow-hidden rounded-4xl border md:rounded-[3rem] lg:aspect-video'>
						<SanityImage
							image={post.coverImage}
							alt={post.title}
							sizes='100vw, (min-width: 1500px) 1600px'
							width={1600}
							height={900}
							className='size-full object-cover'
							loading='eager'
							preload
						/>
					</div>
				</header>

				<article className='mx-auto mt-24 grid max-w-7xl gap-8 md:grid-cols-[7fr_3fr]'>
					{post.content?.length && <PortableText className='' value={post.content as PortableTextBlock[]} />}

					{headings.length > 0 ? (
						<nav aria-label='Spis treści' className='top-24 h-max max-md:-order-1 max-md:mb-8 md:sticky'>
							<p className='mb-2 text-sm font-semibold text-foreground'>Spis treści</p>
							{headings.map(h => (
								<a
									key={h.id}
									href={`#${h.id}`}
									className={cn(
										'line-clamp-1 flex items-center justify-between rounded-md px-2 py-2 text-sm text-foreground/80 hover:bg-white/5',
										h.level === 'h3' && 'pl-5 text-foreground/70'
									)}>
									<span className='line-clamp-1'>{h.text}</span>
									<ChevronRight className='size-4 opacity-60' />
								</a>
							))}
						</nav>
					) : null}
				</article>

				{galleryItems.length > 0 && (
					<section className='mx-auto mt-16 max-w-7xl'>
						<H2 className='mb-8'>Galeria zdjęć</H2>
						<Lightbox items={galleryItems}>
							<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
								{post.gallery!.map((img: any, i: number) => (
									<LightboxTrigger key={(img as any)._key ?? i} index={i} className='block'>
										<div className='aspect-square overflow-hidden rounded-xl border border-border/30'>
											<SanityImage
												image={img}
												alt={(img as any).alt || ''}
												sizes='(min-width: 1024px) 300px, 50vw'
												className='size-full object-cover transition-transform duration-300 hover:scale-105'
											/>
										</div>
									</LightboxTrigger>
								))}
							</div>
						</Lightbox>
					</section>
				)}
			</main>
			<MorePostsSection limit={3} skip={post._id} />
		</div>
	)
}

export function getHeadingsFromPortableText(body?: any[] | null, styles?: string[]) {
	if (!Array.isArray(body)) return []
	const allowedStyles = styles || ['h2', 'h3']
	return body
		.filter(b => b?._type === 'block' && typeof b?.style === 'string')
		.filter(b => allowedStyles.includes(b.style))
		.map(b => {
			const text = Array.isArray(b.children) ? b.children.map((c: any) => c?.text).join('') : ''
			const id = slugify(text)
			return { level: b.style as 'h2' | 'h3', text, id }
		})
		.filter(h => h.text.length >= 2)
}
