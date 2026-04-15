import { CalendlyButton } from '@/components/calendly/calendly-button'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import FooterImage from '~/public/images/process/cel.jpg'
import { FooterContact } from './contact'
import HADAStudiosLogo from '~/public/assets/hadastudios.png'
import Link from 'next/link'

type Props = {}

export const Footer = (props: Props) => {
	const year = new Date().getFullYear() ?? 2026

	return (
		<footer className='relative grid-container container-fill mt-24 overflow-hidden rounded-t-4xl md:rounded-t-[4rem]'>
			{/* Background image */}
			<div className='overlay-75% absolute inset-0 container-fill size-full'>
				<Image src={FooterImage} alt='' className='size-full object-cover object-center' />
			</div>

			{/* CTA */}
			<div className='relative grid-container container-fill space-y-16 bg-grid-128 bg-grid-white/5 py-16 md:space-y-24 md:py-24'>
				<h2 className='font-heading text-7xl leading-[0.95]! mix-blend-difference sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem]'>
					<span className='block text-primary'>
						Zmień swoje <br /> życie{' '}
					</span>
					<span className='block text-right text-foreground'>na lepsze.</span>
				</h2>

				<div className='space-y-3'>
					<CalendlyButton>
						<Button
							variant={'default'}
							className='h-auto w-full rounded-3xl bg-transparent py-8 text-3xl leading-none text-primary mix-blend-difference outline-4 outline-primary hover:bg-gradient-primary hover:text-primary-foreground sm:rounded-4xl sm:py-10 sm:text-4xl md:rounded-[3rem] md:py-12 md:text-5xl lg:text-6xl'>
							Umów darmową rozmowę
						</Button>
					</CalendlyButton>
					<p className='w-full text-center text-sm text-balance sm:text-base sm:leading-none'>
						Bez zobowiązań. Sprawdzimy, czy to dobry kierunek dla Ciebie.
					</p>
				</div>
			</div>

			{/* Contact */}
			<FooterContact />

			{/* Copyright — invisible spacer preserves footer height */}
			<div className='pt-12 md:pt-16 lg:pt-24' aria-hidden='true'>
				<div className='invisible flex flex-col items-center gap-2 text-center font-heading leading-[0.85]! tracking-[-4%] whitespace-nowrap'>
					<span className='block w-full text-[clamp(1rem,23vw,23.25rem)]'>&copy; Krzysztof</span>
					<span className='-mt-2 block w-full text-[clamp(1rem,22.5vw,22.5rem)]'>Kulawik {year}</span>
				</div>
			</div>
			{/* Made by  */}
			<div className='relative z-10 flex w-full items-center justify-between gap-4 px-2 pb-4'>
				<p className='font-heading text-3xl leading-[0.9] text-balance text-primary'>
					Designed & <br /> built by
				</p>
				<Link href={'https://mateuszhada.com'} target='_blank' className=''>
					<Image
						src={HADAStudiosLogo}
						alt='HADA Studios logo'
						className='h-12 w-auto active-scale object-contain hover:scale-105 active:scale-95 active:opacity-80'
						draggable={false}
					/>
					<span className='sr-only'>Strona internetowa Chrzanów wykonana przez Mateusz Hada</span>
				</Link>
			</div>

			{/* Copyright text-mask: full-footer-sized bg image clipped to letterforms */}
			<div
				aria-label={`© Krzysztof Kulawik ${year}`}
				className='pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-2 bg-cover bg-clip-text bg-center pb-24 text-center font-heading leading-[0.85]! tracking-[-4%] whitespace-nowrap text-transparent max-md:text-primary lg:pb-20'
				style={{
					backgroundImage: `url(${FooterImage.src})`
				}}>
				<span className='block w-full text-[clamp(1rem,23vw,23.25rem)]'>&copy; Krzysztof</span>
				<span className='-mt-2 block w-full text-[clamp(1rem,22.5vw,22.5rem)]'>Kulawik {year}</span>
			</div>
		</footer>
	)
}
