import { Button } from '@/components/ui/button'
import Image from 'next/image'
import FooterImage from '~/public/images/process/cel.jpg'
import { FooterContact } from './contact'

type Props = {}

export const Footer = (props: Props) => {
	const year = new Date().getFullYear() ?? 2026

	return (
		<footer className='relative grid-container container-fill mt-24 overflow-hidden rounded-t-[4rem]'>
			{/* Background image */}
			<div className='overlay-75% absolute inset-0 container-fill size-full'>
				<Image src={FooterImage} alt='' className='size-full object-cover object-center' />
			</div>

			{/* CTA */}
			<div className='relative grid-container container-fill space-y-24 bg-grid-128 bg-grid-white/5 py-24'>
				<h2 className='font-heading leading-[0.95]! mix-blend-difference 2xl:text-[12rem]'>
					<span className='block text-primary'>
						Zmień swoje <br /> życie{' '}
					</span>
					<span className='block text-right text-foreground'>na lepsze.</span>
				</h2>

				<div className='space-y-3'>
					<Button
						variant={'default'}
						className='h-auto w-full rounded-[3rem] bg-transparent py-12 text-6xl leading-none text-primary mix-blend-difference outline-4 outline-primary hover:bg-gradient-primary hover:text-primary-foreground'>
						Umów darmową rozmowę
					</Button>
					<p className='w-full text-center leading-none'>
						Bez zobowiązań. Sprawdzimy, czy to dobry kierunek dla Ciebie.
					</p>
				</div>
			</div>

			{/* Contact */}
			<FooterContact />

			{/* Copyright */}
			<div className='pt-24'>
				{/* Image shown through the text letterforms */}

				<div className='relative flex flex-col items-center gap-2 text-center font-heading leading-[0.85]! tracking-[-4%] whitespace-nowrap text-primary/5 mix-blend-difference'>
					<span className='block w-full text-[clamp(1rem,23vw,23.25rem)]'>&copy; Krzysztof</span>
					<span className='-mt-2 block w-full text-[clamp(1rem,22.5vw,22.5rem)]'>Kulawik {year}</span>
				</div>

				{/* <svg
					className='w-full'
					aria-hidden='true'
					viewBox='0 0 1440 620'
					fill='none'
					preserveAspectRatio='xMidYMid slice'
					xmlns='http://www.w3.org/2000/svg'>
					<clipPath id='text-clip'>
						<text
							x='50%'
							y='50%'
							dy='.1em'
							textAnchor='middle'
							className='z-50 font-heading text-[clamp(1rem,23vw,24rem)] leading-[0.85]! whitespace-nowrap text-white mix-blend-multiply'>
							<tspan x='50%' dy='0.1em' className='block w-full'>
								&copy; Krzysztof
							</tspan>
							<tspan x='50%' dy='0.8em' className='block w-full'>
								Kulawik {year}
							</tspan>
						</text>
					</clipPath>
				</svg> */}

				{/* <Image
					src={FooterImage}
					alt=''
					aria-hidden='true'
					className='absolute inset-0 z-0 object-cover object-center'
					style={{ clipPath: 'url(#text-clip)', WebkitClipPath: 'url(#text-clip)' }}
				/> */}
			</div>
		</footer>
	)
}
