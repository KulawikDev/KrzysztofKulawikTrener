import { AboutCertificates, type CertificateDisplay } from './certificates'
import { AboutPhotoSlider, type SlidePhoto } from './photo-slider'
import { sanityFetch } from '@/sanity/lib/live'
import { aboutQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/utils'

export async function About() {
	const { data } = await sanityFetch({ query: aboutQuery })

	if (!data) return null

	const photos: SlidePhoto[] = (data.photos ?? [])
		.map((photo: any) => ({
			src: urlForImage(photo)?.width(700).height(875).fit('crop').url() ?? '',
			blurDataURL: urlForImage(photo)?.width(24).height(24).blur(10).url() ?? '',
			alt: (photo?.alt as string | undefined) ?? 'Krzysztof Kulawik'
		}))
		.filter((p: SlidePhoto) => Boolean(p.src))

	const certificates: CertificateDisplay[] = (data.certificates ?? []).map(
		(cert: { _key: string; image: any; label: string }) => ({
			key: cert._key,
			label: cert.label,
			thumbnailUrl: urlForImage(cert.image)?.width(200).height(200).fit('crop').url() ?? '',
			fullUrl: urlForImage(cert.image)?.width(1400).fit('max').url() ?? ''
		})
	)

	return (
		<section id='o-mnie' className='relative grid-container container-fill section-padding overflow-hidden'>
			{/* Shape grid decoration */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0 container-fill bg-grid-120 bg-grid-foreground mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-[0.05]'
			/>

			<div className='relative'>
				{/*
				 * Heading — on desktop it is removed from normal flow (absolute) so
				 * the grid starts at y = 0. lg:pt-16 on the grid creates the overlap.
				 */}
				<h2 className='relative z-10 font-heading text-[clamp(64px,9vw,128px)] leading-[0.85] text-foreground mix-blend-difference lg:absolute lg:top-0 lg:left-[min(10rem,8.5vw)]'>
					<span className='block'>Poznaj</span>
					<span className='block'>mnie</span>
				</h2>

				{/* Two-column grid ──────────────────────────────────────────────── */}
				<div className='mt-6 flex flex-col gap-10 lg:mt-0 lg:grid lg:grid-cols-[55fr_45fr] lg:gap-x-16 lg:pt-16 lg:pl-[min(19rem,19.5vw)] xl:gap-x-20'>
					{/* Left: photo slideshow */}
					<div className='relative aspect-3/4 w-full overflow-hidden rounded-4xl rounded-tr-[128px]'>
						<AboutPhotoSlider photos={photos} />
					</div>

					{/* Right: bio + certificates */}
					<div className='flex flex-col justify-between gap-12'>
						<div className='flex flex-col gap-6'>
							<p className='max-w-[18rem] font-body text-2xl leading-tight font-bold text-foreground'>
								Sport towarzyszy mi od najmłodszych lat.
							</p>
							<p className='font-body text-base leading-[1.4] text-balance text-foreground/75'>
								W wieku 6 lat rozpocząłem treningi karate, a po siedmiu latach przeszedłem do kickboxingu, który trenuję
								do dziś.
								<br />
								<br />
								To właśnie sport nauczył mnie dyscypliny, konsekwencji, świadomości ciała i szacunku do procesu. Dziś
								łączę własne doświadczenie z wiedzą trenerską, aby pomagać innym trenować skutecznie, mądrze i z
								konkretnym celem.
							</p>
						</div>

						{certificates.length > 0 && <AboutCertificates certificates={certificates} />}
					</div>
				</div>

				{/* Quote — below both columns, left-side alignment */}
				<p className='mt-8 ml-[min(19rem,19.5vw)] max-w-sm font-body text-sm leading-normal text-balance text-foreground lg:mt-8 lg:w-1/2'>
					Nie interesują mnie przypadkowe rozwiązania. Interesuje mnie progres, który ma sens - i który da się utrzymać.
				</p>
			</div>
		</section>
	)
}
