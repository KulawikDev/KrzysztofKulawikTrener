import { CalendlyButton } from '@/components/calendly/calendly-button'
import { Button } from '@/components/ui/button'
import { Marquee, MarqueeContent, MarqueeItem } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'
import SparkSvg from '~/public/assets/spark.svg'

type Props = {}

export const HowToStart = (props: Props) => {
	return (
		<section className='grid-container container-fill section-padding overflow-x-clip'>
			<h2 className='sr-only'>Jak zacząć?</h2>

			<div className='relative z-0 container-fill py-12'>
				<Marquee reverse gap={'0rem'} className='absolute top-1/2 z-10 -translate-y-1/2 rotate-3 mix-blend-difference'>
					<MarqueeContent className=''>
						{[...Array(4)].map((_, i) => (
							<MarqueeItem
								key={i}
								className='flex items-center gap-6 pr-6 text-primary sm:gap-8 sm:pr-8 md:gap-12 md:pr-12 lg:gap-16 lg:pr-16'>
								<span className='font-heading text-5xl leading-none sm:text-6xl md:text-7xl lg:text-8xl'>
									Pierwszy krok jest prosty
								</span>
								<SparkSvg className='-mt-1 size-8 md:size-12 lg:size-16' />
							</MarqueeItem>
						))}
					</MarqueeContent>
				</Marquee>
				<Marquee gap={'0'} className='-rotate-3'>
					<MarqueeContent className='opacity-20 blur-xs'>
						{[...Array(4)].map((_, i) => (
							<MarqueeItem
								key={i}
								className='flex items-center gap-6 pr-6 sm:gap-8 sm:pr-8 md:gap-12 md:pr-12 lg:gap-16 lg:pr-16'>
								<span className='font-heading text-5xl leading-none text-foreground sm:text-6xl md:text-7xl lg:text-8xl'>
									Pierwszy krok jest prosty
								</span>
								<SparkSvg className='-mt-1 size-8 text-primary md:size-12 lg:size-16' />
							</MarqueeItem>
						))}
					</MarqueeContent>
				</Marquee>
			</div>

			<ul className='sm"gap-3 mt-12 flex flex-col gap-2 sm:mt-16 md:mt-24 lg:mt-32'>
				{STEPS.map((step, index) => (
					<li
						key={index}
						className={cn(
							'group grain-overlay-10% relative z-0 bg-gradient-secondary after:-z-10',
							'flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-6 lg:gap-16',
							'first:rounded-t-4xl last:rounded-b-4xl sm:first:rounded-t-[3rem] sm:last:rounded-b-[3rem] lg:first:rounded-t-[4rem] lg:last:rounded-b-[4rem]'
						)}>
						<div className='flex flex-row-reverse gap-4 max-sm:justify-between sm:flex-row sm:items-center sm:gap-10 lg:gap-16'>
							<span className='shrink-0 font-heading text-5xl leading-none text-primary md:text-7xl'>0{index + 1}</span>
							<h3 className='font-heading text-3xl leading-[1.05] text-balance md:text-4xl lg:text-5xl'>
								{step.title}
							</h3>
						</div>
						<p className='text-sm leading-normal text-balance text-foreground/75 group-last:hidden sm:ml-auto sm:max-w-3xs sm:text-right lg:max-w-sm lg:text-base'>
							{step.description}
						</p>

						{index === STEPS.length - 1 && (
							<CalendlyButton>
								<Button className='rounded-b-3xl sm:ml-auto sm:rounded-br-4xl'>Umów darmową rozmowę</Button>
							</CalendlyButton>
						)}
					</li>
				))}
			</ul>
		</section>
	)
}

const STEPS = [
	{
		title: 'Umawiasz darmową rozmowę',
		description: 'Wybierz dogodny termin przez kalendarz już teraz lub skontaktuj się osobiście'
	},
	{
		title: 'Rozmawiamy o twoim celu',
		description: 'Sprawdzamy, z jakiego miejsca startujesz i jaki kierunek będzie dla Ciebie najlepszy'
	},
	{
		title: 'Dobieramy formę współpracy',
		description: 'Ustalamy sposób działania dopasowany do Twoich potrzeb i możliwości'
	},
	{
		title: 'Zaczynamy',
		description: 'Umów darmową rozmowę'
	}
]
