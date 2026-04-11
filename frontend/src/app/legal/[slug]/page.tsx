import InfoAccordion from '@/components/legal/info-accordion'
import InfoToc from '@/components/legal/toc'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { legalPageQuery } from '@/sanity/lib/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params

	const { data } = await sanityFetch({
		query: legalPageQuery,
		params: { slug }
	})

	return {
		title: data?.seoTitle || data?.title || 'Info',
		description: data?.seoDescription || undefined,
		robots: data?.noIndex ? { index: false, follow: false } : undefined
	}
}

export default async function LegalPage({ params }: Props) {
	const { slug } = await params

	const { data } = await sanityFetch({
		query: legalPageQuery,
		params: { slug }
	})
	if (!data) return notFound()

	return (
		<main className='grid-container pt-32 pb-16 md:pb-24'>
			<div className='grid grid-cols-1 gap-10 lg:grid-cols-12'>
				<div className='lg:col-span-8'>
					<h1 className='font-heading text-3xl font-medium md:text-4xl lg:text-5xl'>{data.title}</h1>
					{data.lastUpdated && (
						<p className='mt-4 text-sm text-muted-foreground'>
							Ostatnia aktualizacja: {new Date(data.lastUpdated).toLocaleDateString()}
						</p>
					)}
					{data.intro && <p className='mt-6 text-muted-foreground'>{data.intro}</p>}
					<div className='mt-8'>
						<InfoAccordion sections={data.sections || []} />
					</div>
				</div>

				<aside className='pl-6 lg:col-span-4'>
					<InfoToc items={(data.sections || []).map((s: any) => ({ title: s.title, anchor: s.anchor }))} />
				</aside>
			</div>
		</main>
	)
}
