import { Hero } from '@/components/layout/home/hero'
import { Intro } from '@/components/layout/home/intro'
import { PainPoints } from '@/components/layout/home/pain-points'
import { Process } from '@/components/layout/home/process'
import { Services } from '@/components/layout/home/services'
import { Transformations } from '@/components/layout/home/transformations'

export default async function Page() {
	return (
		<main className='grid-container overflow-x-clip'>
			<Hero />
			<Intro />
			<PainPoints />
			<Transformations />
			{/* Gallery */}
			<Process />
			<Services />
			{/* About me */}
			{/* How to start */}
			{/* Quote */}
			{/* Testimonials */}
			{/* CTA + Footer */}
		</main>
	)
}
