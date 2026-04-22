import { siteConfig } from '@/config/site'
import { urlForImage } from '@/sanity/lib/utils'
import { BlogPosting, ItemList, LocalBusiness, Organization, Person, PostalAddress, WebSite, WithContext } from 'schema-dts'
import { PostQueryResult, ServicesQueryResult, TestimonialsQueryResult } from '../../sanity.types'
import { BASE_URL } from './base-url'

export const OrganisationSchema = (): WithContext<Organization> => {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteConfig.legalName,
		url: BASE_URL,
		logo: `${BASE_URL}/assets/wordmark.svg`,
		email: siteConfig.email,
		telephone: siteConfig.phone,
		legalName: siteConfig.legalName,
		sameAs: Object.values(siteConfig.socials).map(social => social.value),
		address: ADDRESS_LD
	}
}

const ADDRESS_LD: PostalAddress = {
	'@type': 'PostalAddress',
	addressCountry: siteConfig.address.country,
	addressLocality: siteConfig.address.city,
	streetAddress: siteConfig.address.street,
	postalCode: siteConfig.address.postalCode,
	addressRegion: siteConfig.address.region
}

export const WebsiteSchema = (): WithContext<WebSite> => {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: BASE_URL,
		name: siteConfig.name,
		description: siteConfig.metadata.default.description,
		publisher: OrganisationSchema()
	}
}

export const generateBlogPostStructuredData = (post: Required<PostQueryResult>): WithContext<BlogPosting> => {
	const organisation = OrganisationSchema()

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post?.title,
		description: post?.excerpt || undefined,
		url: `${BASE_URL}/blog/${post?.slug}`,
		image: urlForImage(post?.coverImage?.asset?._ref)?.height(720).width(1280).auto('format').url(),
		datePublished: post?.date,
		publisher: organisation
	}
}

export const PersonSchema = (): WithContext<Person> => ({
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: siteConfig.name,
	jobTitle: 'Trener Personalny',
	email: siteConfig.email,
	telephone: siteConfig.phone,
	url: BASE_URL,
	address: ADDRESS_LD,
	sameAs: Object.values(siteConfig.socials).map(s => s.value),
	worksFor: {
		'@type': 'LocalBusiness',
		'@id': BASE_URL,
	} as LocalBusiness,
})

const portableTextToPlain = (
	blocks: Array<{ children?: Array<{ text?: string }> }>
): string =>
	blocks
		.map(b => (b.children ?? []).map(c => c.text ?? '').join(''))
		.join(' ')
		.trim()

export const generateReviewsStructuredData = (
	testimonials: TestimonialsQueryResult
): WithContext<LocalBusiness> => {
	const rated = testimonials.filter(t => t.rating !== null)
	const avgRating = rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / (rated.length || 1)

	return {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': BASE_URL,
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: String(Math.round(avgRating * 10) / 10),
			reviewCount: String(rated.length),
			bestRating: '5',
			worstRating: '1',
		},
		review: testimonials.map(t => ({
			'@type': 'Review' as const,
			author: { '@type': 'Person' as const, name: t.name },
			reviewRating: {
				'@type': 'Rating' as const,
				ratingValue: String(t.rating ?? 5),
				bestRating: '5',
				worstRating: '1',
			},
			...(t.quote?.length ? { reviewBody: portableTextToPlain(t.quote) } : {}),
		})),
	} as unknown as WithContext<LocalBusiness>
}

export const generateServicesSchema = (
	services: ServicesQueryResult
): WithContext<ItemList> => ({
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	name: 'Usługi trenera personalnego',
	itemListElement: services.map((s, i) => ({
		'@type': 'ListItem' as const,
		position: i + 1,
		item: {
			'@type': 'Service' as const,
			name: s.name,
			serviceType: s.label,
			provider: {
				'@type': 'LocalBusiness' as const,
				'@id': BASE_URL,
			},
		},
	})),
} as unknown as WithContext<ItemList>)

export const LocalBusinessSchema = (): WithContext<LocalBusiness> => {
	return {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': BASE_URL,
		name: siteConfig.metadata.default.title,
		description: siteConfig.metadata.default.description,
		url: BASE_URL,
		telephone: siteConfig.phone,
		email: siteConfig.email,
		address: ADDRESS_LD,
		image: `${BASE_URL}/assets/wordmark.svg`,
		sameAs: Object.values(siteConfig.socials).map(social => social.value),
		areaServed: ['Chrzanów', 'Trzebinia', 'Libiąż', 'małopolskie'],
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				opens: '07:00',
				closes: '23:00',

			},
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Sunday'],
				opens: '10:00',
				closes: '20:00'
			}
		]

	}
}
