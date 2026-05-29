import { cn } from '@/lib/utils'

function getEmbedUrl(url: string): string | null {
	try {
		const u = new URL(url)
		if (u.hostname.includes('youtube.com')) {
			const v = u.searchParams.get('v')
			if (v) return `https://www.youtube-nocookie.com/embed/${v}`
		}
		if (u.hostname === 'youtu.be') {
			const v = u.pathname.slice(1)
			if (v) return `https://www.youtube-nocookie.com/embed/${v}`
		}
		if (u.hostname.includes('vimeo.com')) {
			const v = u.pathname.match(/\/(\d+)/)?.[1]
			if (v) return `https://player.vimeo.com/video/${v}`
		}
	} catch {
		return null
	}
	return null
}

export function VideoEmbed({ url, className }: { url: string; className?: string }) {
	const embedUrl = getEmbedUrl(url)
	if (!embedUrl) return null
	return (
		<div className={cn('aspect-video overflow-hidden rounded-2xl', className)}>
			<iframe
				src={embedUrl}
				className='size-full'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
				loading='lazy'
				title='Embedded video'
			/>
		</div>
	)
}
