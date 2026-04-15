import { cn } from '@/lib/utils'
import Image from 'next/image'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Card = {
	title: string
	body: React.ReactNode
	image: string
	className?: string
}

const CARDS: Card[] = [
	{
		title: 'Nie wiesz od czego zacząć',
		body: (
			<>
				Wchodzisz na siłownię i widzisz dziesiątki ćwiczeń, sprzętów i planów z internetu. Każdy mówi coś innego i{' '}
				<strong className='font-bold'>trudno zdecydować, co tak naprawdę ma sens.</strong>
			</>
		),
		image: '/images/shapes/icon-1.webp'
	},
	{
		title: 'Trenujesz, ale nie widzisz efektów',
		body: (
			<>
				Mijasz kolejne tygodnie, robisz treningi, ale{' '}
				<strong className='font-bold'>ciało praktycznie się nie zmienia</strong>. Pojawia się frustracja i pytanie: czy
				robię coś źle?
			</>
		),
		image: '/images/shapes/icon-4.webp'
	},
	{
		title: 'Czujesz, że stoisz w miejscu',
		body: 'Próbujesz różnych rzeczy: inne ćwiczenia, inne treningi, inne metody. Ale zamiast progresu pojawia się chaos.',
		image: '/images/shapes/icon-3.webp'
	},
	{
		title: 'Brakuje ci struktury',
		body: 'Jeden tydzień trenujesz regularnie, potem wszystko się rozsypuje. Plan z internetu przestaje działać, a motywacja spada.',
		image: '/images/shapes/icon-2.webp'
	}
]

// ─── Components ───────────────────────────────────────────────────────────────

function PainCard({ title, body, className, image }: Card) {
	return (
		<div className={cn('flex flex-col gap-8', className)}>
			{/* Icon placeholder */}
			<div className='relative size-24 shrink-0 overflow-hidden'>
				<Image
					src={image}
					alt=''
					className='size-24 object-contain select-none'
					width={96}
					height={96}
					draggable={false}
				/>
			</div>

			{/* Content */}
			<div className='flex flex-col gap-3'>
				<h3 className='font-heading text-4xl leading-none text-balance text-foreground uppercase'>{title}</h3>
				<p className='max-w-sm font-body text-sm leading-[1.25] text-balance text-foreground/70'>{body}</p>
			</div>
		</div>
	)
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function PainPoints() {
	return (
		<section className='section-padding'>
			<div className='grid gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20'>
				{/* Heading ─────────────────────────────────────────────────── */}
				<div className='flex flex-col gap-3 sm:col-span-2 lg:col-span-2 lg:self-start'>
					<h2 className='font-heading text-[clamp(56px,7vw,96px)] leading-none text-primary uppercase'>
						Brzmi znajomo?
					</h2>
					<h3 className='max-w-lg font-heading text-[clamp(28px,3.6vw,48px)] leading-[1.05] text-balance text-foreground uppercase opacity-90'>
						To właśnie w tym momencie większość osób się poddaje
					</h3>
				</div>

				{/* Card 1 – top-right on lg, first card on sm ─────────────── */}
				<PainCard {...CARDS[0]} />

				{/* Row 2 on lg: card 4 · card 3 · card 2 ──────────────────── */}
				<PainCard {...CARDS[3]} className='mt-auto sm:max-lg:pt-16' />
				<PainCard {...CARDS[2]} className='lg:mt-auto' />
				<PainCard {...CARDS[1]} className='sm:max-lg:pt-16 lg:pb-32' />
			</div>
		</section>
	)
}
