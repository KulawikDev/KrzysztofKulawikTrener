'use client'

import { Lightbox, LightboxTrigger, type LightboxItem } from '@/components/lightbox'
import Image from 'next/image'

export type CertificateDisplay = {
	key: string
	label: string
	thumbnailUrl: string
	fullUrl: string
}

export function AboutCertificates({ certificates }: { certificates: CertificateDisplay[] }) {
	const lightboxItems: LightboxItem[] = certificates.map(cert => ({
		// eslint-disable-next-line @next/next/no-img-element
		content: <img src={cert.fullUrl} alt={cert.label} className='h-full w-full object-contain' />,
		label: cert.label
	}))

	const visible = certificates.slice(0, 4)

	return (
		<Lightbox items={lightboxItems}>
			<div className='grid grid-cols-4 gap-3'>
				{visible.map((cert, i) => (
					<LightboxTrigger key={cert.key} index={i} className='w-full'>
						<div className='relative aspect-square w-full overflow-hidden rounded-xl border border-primary'>
							<Image
								src={cert.thumbnailUrl}
								alt={cert.label}
								fill
								className='object-cover'
								sizes='(max-width: 768px) 25vw, 120px'
							/>
						</div>
					</LightboxTrigger>
				))}
			</div>
		</Lightbox>
	)
}
