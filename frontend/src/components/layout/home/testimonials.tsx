import { StructuredData } from '@/components/structured-data'
import { generateReviewsStructuredData } from '@/lib/structuredData'
import { sanityFetch } from '@/sanity/lib/live'
import { testimonialsQuery } from '@/sanity/lib/queries'
import { TestimonialsCarousel } from '../testimonials-carousel'

type Props = {}

export const Testimonials = async (props: Props) => {
	const { data: testimonials } = await sanityFetch({
		query: testimonialsQuery
	})

	if (!testimonials || testimonials.length === 0) {
		return null
	}

	return (
		<section id='opinie' className='scroll-m-24'>
			<StructuredData data={generateReviewsStructuredData(testimonials)} />
			<TestimonialsCarousel testimonials={testimonials} />
		</section>
	)
}
