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
		title: 'Jesz to samo, a waga rośnie',
		body: (
			<>
				Nic nie zmieniłaś w jedzeniu, a spodnie zapinają się coraz gorzej. Słyszałaś, że to wiek i trzeba się pogodzić.
				To nieprawda i wyjaśnię dlaczego.
			</>
		),
		image: '/images/shapes/icon-1.webp'
	},
	{
		title: 'Próbowałaś i za każdym razem wracało',
		body: (
			<>
				Program z internetu, dieta od znajomej, dietetyk, który wyciął węglowodany i odebrał Ci siłę do funkcjonowania.
				Dwa kilogramy w dół, potem wszystko z powrotem, plus poczucie, że znowu Ci nie wyszło.
			</>
		),
		image: '/images/shapes/icon-2.webp'
	},
	{
		title: 'Boisz się, że sobie zaskodzisz',
		body: 'Plecy bolą od biurka, kolana strzykają na schodach. Wiesz, że powinnaś ćwiczyć, ale nikt nigdy nie sprawdził, jak się poruszasz, więc boisz się, że trening pogorszy sprawę.',
		image: '/images/shapes/icon-3.webp'
	},
	{
		title: 'Nie wiesz, od czego zacząć',
		body: 'Wchodzisz na siłownię i widzisz dwudziestolatki i mężczyzn przy sztangach. Wszystko wygląda tak, jakby było dla kogoś innego. Wracasz na bieżnię, bo tam przynajmniej wiesz, co robić.',
		image: '/images/shapes/icon-4.webp'
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
					width={160}
					height={160}
					draggable={false}
					quality={100}
				/>
			</div>

			{/* Content */}
			<div className='flex flex-col gap-3'>
				<h3 className='font-heading text-4xl leading-none text-balance text-foreground uppercase'>{title}</h3>
				<p className='max-w-sm font-body text-sm leading-[1.5] text-balance text-foreground/70'>{body}</p>
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
						To właśnie w tym momencie większość kobiet się poddaje
					</h3>
				</div>

				{/* Card 1 – top-right on lg, first card on sm ─────────────── */}
				<PainCard {...CARDS[0]} />

				{/* Row 2 on lg: card 4 · card 3 · card 2 ──────────────────── */}
				<PainCard {...CARDS[3]} className='mt-auto sm:max-lg:pt-16' />
				<PainCard {...CARDS[2]} className='lg:mt-auto' />
				<PainCard {...CARDS[1]} className='sm:max-lg:pt-16 lg:pb-32' />
			</div>

			<div className='mt-24 lg:mt-32'>
				<p className='ml-auto max-w-lg text-right text-lg text-balance'>
					Żadna z tych rzeczy nie jest kwestią wieku ani silnej woli. Wszystkie są kwestią tego, że nikt Ci nie
					wytłumaczył, jak działa Twoje ciało po czterdziestce.
				</p>
			</div>
		</section>
	)
}
