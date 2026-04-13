import { urlForImage } from '@/sanity/lib/utils'
import { getImageDimensions } from '@sanity/asset-utils'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image, { ImageProps } from 'next/image'

type Props = {
	image: any
	src?: string | StaticImport
	className?: string
} & Omit<ImageProps, 'src'>

export const SanityImage = ({ image, sizes, alt, className, quality = 80, src, ...props }: Props) => {
	return (
		image && (
			<Image
				src={src || (urlForImage(image)?.quality(Number(quality)).url() as string)}
				alt={alt || ''}
				width={getImageDimensions(image).width}
				height={getImageDimensions(image).height}
				placeholder='blur'
				blurDataURL={urlForImage(image)?.width(24).height(24).blur(10).url()}
				sizes={sizes}
				className={className}
				draggable={false}
				{...props}
			/>
		)
	)
}
