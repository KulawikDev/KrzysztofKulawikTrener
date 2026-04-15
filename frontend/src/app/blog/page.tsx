import { Post, PostsGrid } from '@/components/blog/posts'
import H1 from '@/components/ui/typography/h1'
import { sanityFetch } from '@/sanity/lib/live'
import { allPostsQuery } from '@/sanity/lib/queries'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {}

export async function generateMetadata({}: Props, parent: ResolvingMetadata): Promise<Metadata> {
	return {
		title: 'Blog',
		description:
			'Porady treningowe, wskazówki dla początkujących i sprawdzone podejście do budowania formy. Blog prowadzony przez trenera personalnego z Chrzanowa.'
	} satisfies Metadata
}

export default async function BlogPage({}: Props) {
	const [{ data: posts }] = await Promise.all([sanityFetch({ query: allPostsQuery })])

	if (!posts || !posts?.length) return notFound()

	return (
		<main className='grid-container py-24'>
			<div className='relative mt-6 mb-12 flex h-max flex-col gap-x-24 gap-y-2 md:flex-row md:items-end md:justify-between'>
				<H1 className='max-w-4xl text-balance wrap-break-word'>Wiedza, która pomaga budować formę</H1>
				<p className='mt-2 max-w-sm text-sm text-balance'>
					Porady treningowe, wskazówki dla początkujących i sprawdzone podejście do budowania formy. Blog prowadzony
					przez trenera personalnego z Chrzanowa.
				</p>
			</div>

			<PostsGrid>
				{posts?.map((post, i) => (
					<Post key={post._id} post={post as any} />
				))}
			</PostsGrid>
		</main>
	)
}
