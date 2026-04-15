import { CarouselContainer, CarouselProvider, CarouselViewport } from '@/components/carousel/carousel'
import { sanityFetch } from '@/sanity/lib/live'
import { servicesQuery } from '@/sanity/lib/queries'
import { ServiceCard } from './card'
import { ServicesControls } from './client'

export async function Services() {
	const { data } = await sanityFetch({ query: servicesQuery })

	if (!data?.length) return null

	return (
		<section className='relative grid-container container-fill section-padding'>
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0 flex items-center justify-center select-none'>
				<p
					className='shrink-0 rotate-12 font-heading text-[min(55vw,789px)] leading-[0.85] whitespace-nowrap text-transparent uppercase opacity-10'
					style={{ WebkitTextStroke: '1px var(--color-primary)' }}>
					Forma
				</p>
			</div>

			<div className='mb-12 flex flex-col-reverse gap-6 md:flex-row md:items-end md:justify-between'>
				<p className='max-w-sm font-body text-sm leading-relaxed text-foreground/75 md:max-w-91.25'>
					Współpraca może wyglądać różnie - najważniejsze, żeby była dopasowana do Twojego celu i tego, jak
					funkcjonujesz na co dzień.
				</p>

				<h2 className='font-heading text-[clamp(40px,6.7vw,96px)] leading-none text-foreground uppercase md:text-right'>
					Wybierz formę, która <br /> pasuje do Ciebie
				</h2>
			</div>
			<div className='relative z-10 grid-container container-fill overflow-x-clip'>
				{/* Section header */}

				<CarouselProvider
					options={{ align: 'start', containScroll: 'trimSnaps', dragFree: false }}
					withCursorFollower
					className='overflow-x-visible'>
					<CarouselViewport className='overflow-visible'>
						<CarouselContainer className='-ml-5'>
							{data.map(service => (
								<div key={service._id} className='shrink-0 basis-[min(calc(100vw-2rem),800px)] pl-5'>
									<ServiceCard {...service} />
								</div>
							))}
						</CarouselContainer>
					</CarouselViewport>

					{/* <div className='grid-container mt-8 md:mt-12'>
						<div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-6'>
							<CarouselDots />
							<CarouselArrows />
						</div>
					</div> */}
					<ServicesControls services={data} />
				</CarouselProvider>
			</div>
		</section>
	)
}
