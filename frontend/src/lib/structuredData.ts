import { siteConfig } from '@/config/site'
import { urlForImage } from '@/sanity/lib/utils'
import { BlogPosting, Organization, PostalAddress, WebSite, WithContext } from 'schema-dts'
import { PostQueryResult } from '../../sanity.types'
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