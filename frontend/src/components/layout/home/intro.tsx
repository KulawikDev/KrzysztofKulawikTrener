import { CalendlyButton } from '@/components/calendly/calendly-button'
import { RippleButton } from '@/components/ui/button-effects'

export function Intro() {
	return (
		<section className='flex section-padding flex-col items-center gap-12 text-center md:gap-16'>
			<p className='max-w-250 font-heading text-[clamp(26px,3.3vw,48px)] leading-[1.15] text-foreground opacity-90'>
				Pomagam początkującym, osobom zapracowanym, sportowcom i trenującym rekreacyjnie budować lepszą formę, większą
				sprawność i trwałe rezultaty poprzez trening personalny dopasowany do celu, poziomu i stylu życia.
			</p>
			<CalendlyButton>
				<RippleButton>Umów darmową rozmowę</RippleButton>
			</CalendlyButton>
		</section>
	)
}
