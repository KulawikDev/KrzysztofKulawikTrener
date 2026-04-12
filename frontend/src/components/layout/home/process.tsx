import { cn } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Step = {
	title: string
	image: string | null
	description: string
	descriptionOpacity?: 'muted' | 'full'
}

const STEPS: Step[] = [
	{
		title: 'CEL',
		image: '/images/process/cel.jpg',
		description: 'Najpierw ustalamy, do czego dążysz i co realnie chcesz osiągnąć podczas naszej współpracy.'
	},
	{
		title: 'STRATEGIA',
		image: '/images/process/strategia.png',
		description: 'Dobieramy działania do Twojego poziomu, możliwości, ograniczeń i codziennego rytmu życia.'
	},
	{
		title: 'PROCES',
		image: '/images/process/proces.jpg',
		description: 'Budujemy regularność, technikę i progres krok po kroku – bez chaosu i bez zgadywania.'
	},
	{
		title: 'REZULTAT',
		image: null,
		description:
			'Efektem ma być nie tylko lepsza forma, ale też większa kontrola, pewność siebie i sprawność na co dzień.',
		descriptionOpacity: 'full'
	}
]

// ─── Step row ─────────────────────────────────────────────────────────────────

function ProcessStep({ title, image, description, descriptionOpacity }: Step) {
	const textSizeClass = 'text-[clamp(64px,16.32vw,235px)]'

	return (
		<div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:py-0'>
			{/* Big label */}
			{image ? (
				<span
					className={cn('shrink-0 bg-clip-text font-heading leading-[0.85]! text-transparent uppercase', textSizeClass)}
					style={{
						backgroundImage: `url('${image}')`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						WebkitTextStroke: '1.5px var(--color-primary)'
					}}>
					{title}
				</span>
			) : (
				<span className={cn('shrink-0 font-heading leading-[0.85]! text-primary uppercase', textSizeClass)}>
					{title}
				</span>
			)}

			{/* Description */}
			<p
				className={cn(
					'max-w-sm font-body text-base leading-relaxed text-balance md:w-[340px] md:max-w-none md:shrink-0',
					descriptionOpacity === 'full' ? 'text-foreground' : 'text-foreground/70'
				)}>
				{description}
			</p>
		</div>
	)
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Process() {
	return (
		<section className='relative section-padding'>
			{/* Steps */}
			<div className='flex flex-col'>
				{STEPS.map(step => (
					<ProcessStep key={step.title} {...step} />
				))}
			</div>

			{/* Decorative "SUKCES" watermark – right edge, large screens only */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-y-0 -right-[10%] hidden w-96 items-center justify-center select-none xl:flex'>
				<p
					className='shrink-0 rotate-90 font-heading text-[443px] leading-[0.85] whitespace-nowrap text-transparent uppercase opacity-10'
					style={{ WebkitTextStroke: '1px var(--color-primary)' }}>
					SUKCES
				</p>
			</div>
		</section>
	)
}
