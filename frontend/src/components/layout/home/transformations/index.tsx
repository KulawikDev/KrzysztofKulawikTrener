import { sanityFetch } from '@/sanity/lib/live'
import { transformationsQuery } from '@/sanity/lib/queries'
import { TransformationsSection } from './client'

export const Transformations = async () => {
	const { data } = await sanityFetch({ query: transformationsQuery })

	if (!data?.length) return null

	return (
		<section className='scroll-m-12'>
			<TransformationsSection transformations={data} />
		</section>
	)
}
