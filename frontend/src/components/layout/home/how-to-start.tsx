import { Button } from '@/components/ui/button'
import { Marquee, MarqueeContent, MarqueeItem } from '@/components/ui/marquee'
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
							<MarqueeItem key={i} className='flex items-center gap-16 pr-16 text-primary'>
								<span className='font-heading text-8xl leading-none'>Pierwszy krok jest prosty</span>
								<SparkSvg className='-mt-1 size-16' />
							</MarqueeItem>
						))}
					</MarqueeContent>
				</Marquee>
				<Marquee gap={'0'} className='-rotate-3'>
					<MarqueeContent className='opacity-20 blur-xs'>
						{[...Array(4)].map((_, i) => (
							<MarqueeItem key={i} className='flex items-center gap-16 pr-16'>
								<span className='font-heading text-8xl leading-none text-foreground'>Pierwszy krok jest prosty</span>
								<SparkSvg className='-mt-1 size-16 text-primary' />
							</MarqueeItem>
						))}
					</MarqueeContent>
				</Marquee>
			</div>

			<ul className='mt-32 flex flex-col gap-3'>
				{STEPS.map((step, index) => (
					<li
						key={index}
						className='group grain-overlay-10% relative z-0 flex items-center gap-16 bg-gradient-secondary px-8 py-6 after:-z-10 first:rounded-t-[4rem] last:rounded-b-[4rem]'>
						<span className='text-7xl leading-none text-primary'>0{index + 1}</span>
						<h3 className='font-heading text-5xl leading-none'>{step.title}</h3>
						<p className='ml-auto max-w-sm text-right leading-normal text-balance text-foreground/75 group-last:hidden'>
							{step.description}
						</p>

						{index === STEPS.length - 1 && <Button className='ml-auto rounded-br-4xl'>Umów darmową rozmowę</Button>}
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
