import { CalendlyButton } from '@/components/calendly/calendly-button'
import { RippleButton } from '@/components/ui/button-effects'

export function Intro() {
	return (
		<section className='flex section-padding flex-col items-center gap-12 text-center md:gap-16'>
			<p className='max-w-250 font-heading text-[clamp(26px,3vw,40px)] leading-[1.15] text-balance text-foreground/70'>
				<span className='text-foreground'>Prowadzę kobiety, które chcą schudnąć albo wzmocnić ciało,</span> a boją się,
				że jest już za późno albo że sobie zaszkodzą. <br />
				<br /> Zanim dołożę Ci pierwszy ciężar, <span className='text-foreground'>sprawdzam, jak się poruszasz</span>.
				Potem <span className='text-foreground'>uczę Cię, co robisz i dlaczego</span>, żebyś po trzech miesiącach{' '}
				<span className='text-foreground'>wiedziała o swoim ciele więcej</span> niż przez ostatnie dziesięć lat.
			</p>
			<div>
				<CalendlyButton>
					<RippleButton>Umów rozmowę</RippleButton>
				</CalendlyButton>
				<p className='mt-4 max-w-sm text-center text-sm text-balance text-muted-foreground'>
					20 minut, bez zobowiązań. Sprawdzimy, czy to dobry kierunek dla Ciebie.
				</p>
			</div>
		</section>
	)
}
