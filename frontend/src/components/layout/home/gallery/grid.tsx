'use client'

import { Lightbox, LightboxTrigger, type LightboxItem } from '@/components/lightbox'
import { PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GalleryImageItem = {
	_key: string
	type: 'image'
	thumbSrc: string
	fullSrc: string
	blurDataURL: string
	width: number
	height: number
	alt: string
	caption: string | null
}

export type GalleryVideoItem = {
	_key: string
	type: 'video'
	videoUrl: string
	posterSrc: string | null
	posterBlur: string | null
	posterWidth: number
	posterHeight: number
	caption: string | null
}

export type GalleryItem = GalleryImageItem | GalleryVideoItem

// ── Grid ──────────────────────────────────────────────────────────────────────

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
	const lightboxItems: LightboxItem[] = useMemo(
		() =>
			items.map(item => {
				if (item.type === 'image') {
					return {
						// eslint-disable-next-line @next/next/no-img-element
						content: <img src={item.fullSrc} alt={item.alt} draggable={false} className='size-full object-contain' />,
						// eslint-disable-next-line @next/next/no-img-element
						thumbnail: <img src={item.thumbSrc} alt={item.alt} draggable={false} className='size-full object-cover' />,
						label: item.caption
					}
				}
				// video — `key` on the video element ensures it resets on slide change
				return {
					content: (
						<video
							key={item._key}
							src={item.videoUrl}
							controls
							playsInline
							poster={item.posterSrc ?? undefined}
							className='size-full object-contain'
						/>
					),
					thumbnail: item.posterSrc ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={item.posterSrc} alt={item.caption ?? 'Video'} className='size-full object-cover' />
					) : undefined,
					label: item.caption
				}
			}),
		[items]
	)

	return (
		<Lightbox items={lightboxItems}>
			{/* // from 0px (default) display max 6 images (hide all after 6th), from sm: 9 images, from lg: 8 images, from xl: 10 */}
			<div className='columns-2 gap-2 sm:columns-3 md:gap-3 lg:columns-4 xl:columns-5'>
				{items.map((item, i) => (
					<div
						key={item._key}
						className='mb-2 break-inside-avoid max-sm:nth-[n+7]:hidden sm:max-lg:nth-[n+10]:hidden md:mb-3 lg:max-xl:nth-[n+9]:hidden'>
						<LightboxTrigger index={i} className='block w-full'>
							{item.type === 'image' ? <ImageTile item={item} priority={i < 6} /> : <VideoTile item={item} />}
							<span className='sr-only'>Otwórz {item.type === 'image' ? 'obraz' : 'wideo'} w galerii</span>
						</LightboxTrigger>
					</div>
				))}
			</div>
		</Lightbox>
	)
}

// ── Image tile ────────────────────────────────────────────────────────────────

function ImageTile({ item, priority }: { item: GalleryImageItem; priority: boolean }) {
	return (
		<div className='group relative overflow-hidden rounded-xl'>
			<Image
				src={item.thumbSrc}
				alt={item.alt}
				width={item.width}
				height={item.height}
				placeholder='blur'
				blurDataURL={item.blurDataURL}
				// responsive sizes per column count
				sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
				className='pointer-events-none size-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.04]'
				priority={priority}
				draggable={false}
			/>
			{item.caption && (
				<div className='absolute inset-x-0 bottom-0 mx-1.5 translate-y-[calc(100%+0.25rem)] rounded-md bg-black/25 px-2 py-1.5 text-xs leading-snug text-white backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1.5'>
					{item.caption}
				</div>
			)}
		</div>
	)
}

// ── Video tile ────────────────────────────────────────────────────────────────

function VideoTile({ item }: { item: GalleryVideoItem }) {
	return (
		<div className='group relative overflow-hidden rounded-xl'>
			{/* Poster image — no <video> tag in the grid, zero bandwidth wasted */}
			{item.posterSrc ? (
				<Image
					src={item.posterSrc}
					alt={item.caption ?? 'Video'}
					width={item.posterWidth}
					height={item.posterHeight}
					placeholder={item.posterBlur ? 'blur' : undefined}
					blurDataURL={item.posterBlur ?? undefined}
					sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
					className='w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.04]'
					loading='lazy'
				/>
			) : (
				<div className='aspect-video w-full bg-muted' />
			)}

			{/* Play button overlay */}
			<div className='absolute inset-0 flex items-center justify-center'>
				<div className='flex size-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110'>
					<PlayIcon className='size-5 translate-x-0.5 fill-white' />
				</div>
			</div>

			{item.caption && (
				<div className='absolute inset-x-0 bottom-0 mx-1.5 translate-y-[calc(100%+0.25rem)] rounded-md bg-black/25 px-2 py-1.5 text-xs leading-snug text-white backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1.5'>
					{item.caption}
				</div>
			)}
		</div>
	)
}
