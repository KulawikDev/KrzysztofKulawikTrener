import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Intro() {
	return (
		<section className='flex section-padding flex-col items-center gap-12 text-center md:gap-16'>
			<p className='max-w-250 font-heading text-[clamp(26px,3.3vw,48px)] leading-[1.15] text-foreground opacity-90'>
				Pomagam początkującym, osobom zapracowanym, sportowcom i trenującym rekreacyjnie budować lepszą formę, większą
				sprawność i trwałe rezultaty poprzez trening personalny dopasowany do celu, poziomu i stylu życia.
			</p>

			<Button asChild>
				<Link href={'#kontakt'}>Umów darmową rozmowę</Link>
			</Button>
		</section>
	)
}
