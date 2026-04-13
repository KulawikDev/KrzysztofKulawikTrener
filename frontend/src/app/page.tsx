import { About } from '@/components/layout/home/about'
import { Gallery } from '@/components/layout/home/gallery'
import { Hero } from '@/components/layout/home/hero'
import { HowToStart } from '@/components/layout/home/how-to-start'
import { Intro } from '@/components/layout/home/intro'
import { PainPoints } from '@/components/layout/home/pain-points'
import { Process } from '@/components/layout/home/process'
import { Quote } from '@/components/layout/home/quote'
import { Services } from '@/components/layout/home/services'
import { Testimonials } from '@/components/layout/home/testimonials'
import { Transformations } from '@/components/layout/home/transformations'

export default async function Page() {
	return (
		<main className='grid-container overflow-x-clip'>
			<Hero />
			<Intro />
			<PainPoints />
			<Transformations />
			<Gallery />
			<Process />
			<Services />
			<About />
			<HowToStart />
			<Quote />
			<Testimonials />
		</main>
	)
}
