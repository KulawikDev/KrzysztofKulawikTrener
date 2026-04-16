import Image from 'next/image'
import HeroPerson from '~/public/images/hero/hero-person.webp'
import NamePatternImg from '~/public/images/decoration/name-pattern-vertical.webp'
import HeroImage from '~/public/images/hero/hero-image.webp'

export function Hero() {
	return (
		<section className='relative z-0 grid-container container-fill min-h-[600px] overflow-hidden sm:min-h-[720px] lg:min-h-screen'>
			{/* Background image with dark overlay */}
			<div className='overlay-75% absolute inset-0 -z-10 container-fill'>
				<Image
					src={HeroImage}
					alt='Zdjęcie osoby ćwiczącej na siłowni w Chrzanowie'
					className='size-full object-cover object-center'
					preload
					sizes='100vw'
					aria-hidden='true'
				/>
			</div>

			{/* 7 diagonal lines */}
			<div aria-hidden='true' className='pointer-events-none absolute inset-0 z-0 container-fill'>
				<svg
					className='size-full stroke-white/10'
					viewBox='0 0 1440 925'
					preserveAspectRatio='none'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'>
					{[170, 350, 530, 720, 900, 1080, 1260].map(x => (
						<line key={x} x1={x} y1={0} x2={x} y2={925} strokeWidth='1' />
					))}
				</svg>
			</div>

			{/* Yellow diagonal slash – mix-blend-difference */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute right-0 z-0 h-full w-[58vw] sm:w-104 md:w-120 lg:w-120'>
				<div className='absolute -inset-y-1/5 z-0 h-auto w-full rotate-12 skew-x-[4deg] bg-primary mix-blend-difference'>
					<Image
						src={NamePatternImg}
						alt=''
						draggable={false}
						width={500}
						fetchPriority='high'
						loading='eager'
						className='pointer-events-none h-full w-auto object-cover opacity-10 md:block'
						aria-hidden='true'
					/>
				</div>
				{/* Person image */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute right-0 bottom-0 z-20 block h-full max-h-105 w-auto sm:max-h-135 lg:max-h-195'>
					<Image
						src={HeroPerson}
						alt='Zdjęcie trenera personalnego Krzysztofa Kulawika'
						className='h-full max-h-full w-auto max-w-none object-contain object-bottom'
						height={800}
						preload
					/>
				</div>
				<div className='relative z-30 flex h-full w-full -translate-x-[16%] flex-col items-center justify-end pb-2 opacity-0 mix-blend-difference lg:opacity-100'>
					<p className='font-heading text-[clamp(14px,2.2vw,28px)] leading-[1.15] text-white/90'>
						Krzysztof Kulawik - Trener Personalny
					</p>
				</div>
			</div>

			{/* Bottom gradient for headline readability */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 bottom-0 z-25 h-64 bg-linear-to-t from-black/75 to-transparent lg:hidden'
			/>
			{/* Grain texture */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0 z-10 container-fill opacity-40 mix-blend-overlay'
				style={{
					backgroundImage: "url('/images/decoration/grain.webp')",
					backgroundSize: '150px',
					backgroundPosition: 'top left'
				}}
			/>

			{/* Headline – bottom-left aligned */}
			<div className='relative isolate z-40 mt-auto pb-6 md:pb-8 lg:pb-12 lg:mix-blend-difference'>
				<h1 className='z-0 max-w-xl font-heading text-[clamp(48px,8.9vw,128px)] leading-[0.9] tracking-tight text-balance text-foreground uppercase sm:max-w-2xl xl:max-w-3xl'>
					Pomagam Ci stać się <span className='text-primary'>lepszą wersją samego siebie</span>
				</h1>
			</div>
		</section>
	)
}
