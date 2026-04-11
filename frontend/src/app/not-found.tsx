import { buttonVariants } from '@/components/ui/button'
import H1 from '@/components/ui/typography/h1'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export const metadata = {
	title: '404'
}

export default function NotFound() {
	return (
		<main className='grid-container my-12 h-full grow md:my-24'>
			<div className='relative flex h-full w-full flex-col items-center justify-center py-16'>
				<H1 className='my-6 text-center'>Nie odnaleziono strony</H1>
				<h2 className='sr-only'>404</h2>
				<svg
					aria-hidden
					viewBox='0 0 28 13'
					className='absolute -z-20 w-[60%] min-w-72 fill-secondary font-heading uppercase opacity-10'>
					<text x='0' y='12'>
						404
					</text>
				</svg>
				<p className='max-w-md text-center text-lg leading-tight text-muted-foreground lg:text-xl'>
					Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
				</p>

				<div className='mt-12 flex w-full max-w-sm flex-col items-center gap-4 sm:flex-row sm:justify-center'>
					<Link href='/' className={cn(buttonVariants({ size: 'lg' }), 'max-sm:w-full')}>
						Strona Główna
					</Link>
				</div>
			</div>
		</main>
	)
}
