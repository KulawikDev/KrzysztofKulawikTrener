import { Hero } from '@/components/layout/home/hero'
import { Intro } from '@/components/layout/home/intro'
import { PainPoints } from '@/components/layout/home/pain-points'

export default async function Page() {
	return (
		<main className='grid-container overflow-x-clip'>
			<Hero />
			<Intro />
			<PainPoints />
		</main>
	)
}
