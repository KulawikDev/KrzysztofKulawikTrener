import { sanityFetch } from '@/sanity/lib/live'
import { galleryQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/utils'
import { getImageDimensions } from '@sanity/asset-utils'
import { GalleryGrid, type GalleryItem } from './grid'

export async function Gallery() {
	const { data } = await sanityFetch({ query: galleryQuery })

	if (!data?.items?.length) return null

	const items: GalleryItem[] = (data.items as any[])
		.map((item): GalleryItem | null => {
			// ── Image ──────────────────────────────────────────────────────────
			if (item._type === 'galleryImage') {
				if (!item.image?.asset?._ref) return null

				const { width, height } = getImageDimensions(item.image)

				return {
					_key: item._key,
					type: 'image',
					// Thumbnail capped at 900px — serves 4-column grid at any viewport
					thumbSrc: urlForImage(item.image)?.width(400).auto('format').url() ?? '',
					// Full-res for lightbox (up to 1200px, auto WebP/AVIF)
					fullSrc: urlForImage(item.image)?.width(1200).auto('format').url() ?? '',
					// Tiny blur placeholder pre-computed server-side
					blurDataURL: urlForImage(item.image)?.width(20).height(20).blur(10).url() ?? '',
					width,
					height,
					alt: (item.image.alt as string | undefined) ?? '',
					caption: item.caption ?? null
				}
			}

			// ── Video ──────────────────────────────────────────────────────────
			if (item._type === 'galleryVideo') {
				if (!item.videoUrl) return null

				let posterData = {
					posterSrc: null as string | null,
					posterBlur: null as string | null,
					posterWidth: 16,
					posterHeight: 9
				}

				if (item.thumbnail?.asset?._ref) {
					const { width, height } = getImageDimensions(item.thumbnail)
					posterData = {
						posterSrc: urlForImage(item.thumbnail)?.width(900).auto('format').url() ?? null,
						posterBlur: urlForImage(item.thumbnail)?.width(20).height(20).blur(10).url() ?? null,
						posterWidth: width,
						posterHeight: height
					}
				}

				return {
					_key: item._key,
					type: 'video',
					videoUrl: item.videoUrl,
					...posterData,
					caption: item.caption ?? null
				}
			}

			return null
		})
		.filter((x): x is GalleryItem => x !== null)

	if (!items.length) return null

	return (
		<section id='galeria' className='grid-container container-fill section-padding md:pt-0'>
			<div className='relative flex flex-col gap-8 md:gap-12'>
				<h2
					className='mx-auto -mb-28 shrink-0 text-center font-heading text-[16rem] leading-[0.85] whitespace-nowrap text-transparent uppercase opacity-10'
					style={{ WebkitTextStroke: '1.5px var(--color-primary)' }}>
					Tak działamy
				</h2>
				<GalleryGrid items={items} />
			</div>
		</section>
	)
}
