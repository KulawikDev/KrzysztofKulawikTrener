/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import { PortableText, type PortableTextComponents, type PortableTextBlock } from 'next-sanity'
import ResolvedLink from '@/components/resolved-link'
import { SanityImage } from '@/components/sanity-image'
import { VideoEmbed } from '@/components/video-embed'
import slugify from 'slugify'

export default function CustomPortableText({ className, value }: { className?: string; value: PortableTextBlock[] }) {
	const components: PortableTextComponents = {
		types: {
			image: ({ value }) => (
				<figure className='my-8'>
					<SanityImage
						image={value}
						alt={value.alt || ''}
						sizes='(min-width: 1024px) 800px, 100vw'
						className='w-full rounded-2xl'
					/>
					{value.caption && (
						<figcaption className='mt-2 text-center text-sm text-muted-foreground'>{value.caption}</figcaption>
					)}
				</figure>
			),
			videoEmbed: ({ value }) => (
				<div className='my-8'>
					<VideoEmbed url={value.url} />
					{value.caption && <p className='mt-2 text-center text-sm text-muted-foreground'>{value.caption}</p>}
				</div>
			)
		},
		block: {
			h1: ({ children, value }) => (
				// Add an anchor to the h1
				<h1 className='group relative'>
					{children}
					<a
						href={`#${value?._key}`}
						className='absolute top-0 bottom-0 left-0 -ml-6 flex items-center opacity-0 transition-opacity group-hover:opacity-100'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
							/>
						</svg>
					</a>
				</h1>
			),
			h2: ({ children, value }) => {
				const id = slugify(String(children))
				return (
					<h2
						id={id}
						className='group relative mt-[1.5em] mb-[0.5em] font-heading text-4xl font-medium text-balance sm:text-5xl lg:text-6xl'>
						{children}
					</h2>
				)
			},
			h3: ({ children }: any) => {
				const id = slugify(String(children))
				return (
					<h3 id={id} className='scroll-mt-28 text-xl font-semibold text-foreground'>
						{children}
					</h3>
				)
			}
		},
		marks: {
			link: ({ children, value: link }) => {
				return <ResolvedLink link={link}>{children}</ResolvedLink>
			}
		}
	}

	return (
		<div className={['prose prose-invert prose-a:text-primary', className].filter(Boolean).join(' ')}>
			<PortableText components={components} value={value} />
		</div>
	)
}
