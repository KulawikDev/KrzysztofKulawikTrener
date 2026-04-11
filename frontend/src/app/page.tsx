import { ContactForm } from '@/components/contact-form'
import H1 from '@/components/ui/typography/h1'

export default async function Page() {
	return (
		<main className='grid-container py-24'>
			<header className='min-h-[50vh] pt-12'>
				<H1 className='mb-2'>Hello, World!</H1>
				<p>This is a starter template for a Next.js project integrated with Sanity CMS.</p>

				<div className='max-w-xl section-padding'>
					<ContactForm />
				</div>
			</header>
		</main>
	)
}
