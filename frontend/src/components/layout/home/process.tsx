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
		image: '/images/process/cel.webp',
		description:
			'Ustalamy, gdzie chcesz być za trzy miesiące. Nie "schudnąć", tylko konkretnie: ile, w czym ma Ci być lżej, co chcesz móc zrobić, czego dziś nie możesz.'
	},
	{
		title: 'ANALIZA',
		image: '/images/process/strategia.webp',
		description:
			'Sprawdzam Twoją postawę, mobilność i to, jak się poruszasz. Bark po dwudziestu latach przy biurku i kolano, które strzyka na schodach, to nie są detale. To jest punkt wyjścia całego planu.'
	},
	{
		title: 'PROCES',
		image: '/images/process/proces.webp',
		description:
			'Uczę Cię techniki, zanim dołożę ciężar. Tłumaczę, dlaczego robimy każde ćwiczenie. Ciężar rośnie w tempie, które Twoje ciało uniesie, a nie w tempie, które dobrze wygląda na filmiku.'
	},
	{
		title: 'REZULTAT',
		image: null,
		description:
			'Silniejsze ciało, więcej energii i wiedza, która zostaje z Tobą na lata. Sylwetka jest skutkiem, nie celem.',
		descriptionOpacity: 'full'
	}
]

// ─── Step row ─────────────────────────────────────────────────────────────────

function ProcessStep({ title, image, description, descriptionOpacity }: Step) {
	const textSizeClass = 'text-[clamp(4rem,25vw,10rem)] md:text-[clamp(4rem,16vw,15rem)]'

	return (
		<div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:py-0'>
			{image ? (
				<span
					className={cn(
						'shrink-0 bg-cover bg-clip-text bg-center font-heading leading-[0.85]! uppercase md:text-transparent md:[-webkit-text-stroke:1.5px_var(--color-primary)]',
						textSizeClass
					)}
					style={{
						backgroundImage: `url('${image}')`
					}}>
					{title}
				</span>
			) : (
				<span className={cn('shrink-0 font-heading leading-[0.85]! text-primary uppercase', textSizeClass)}>
					{title}
				</span>
			)}

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
			<div className='flex flex-col gap-12 md:gap-0'>
				{STEPS.map(step => (
					<ProcessStep key={step.title} {...step} />
				))}
			</div>

			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-y-0 -right-[10%] hidden w-96 items-center justify-center select-none xl:flex'>
				<p
					className='shrink-0 rotate-90 font-heading text-[28rem] leading-[0.85] whitespace-nowrap text-transparent uppercase opacity-10'
					style={{ WebkitTextStroke: '1px var(--color-primary)' }}>
					Sukces
				</p>
			</div>
		</section>
	)
}
