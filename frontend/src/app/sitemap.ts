import { BASE_URL } from '@/lib/base-url'
import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { sitemapData } from '@/sanity/lib/queries'

type Sitemap = MetadataRoute.Sitemap

const _ROUTES: Pick<Sitemap[number], 'url' | 'changeFrequency' | 'priority'>[] = [
	{ url: '', priority: 1, changeFrequency: 'monthly' },
	{ url: '/blog', priority: 0.1, changeFrequency: 'weekly' }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const allPostsAndPages = await sanityFetch({
		query: sitemapData
	})
	const sitemap: MetadataRoute.Sitemap = []

	_ROUTES.map(route => {
		const lastModified = new Date()

		sitemap.push({
			...route,
			url: `${BASE_URL}${route.url}`,
			lastModified
		})
	})

	if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
		let priority: number
		let changeFrequency: 'monthly' | 'always' | 'hourly' | 'daily' | 'weekly' | 'yearly' | 'never' | undefined
		let url: string

		for (const p of allPostsAndPages.data) {
			switch (p._type) {
				case 'legalPage':
					priority = 0.1
					changeFrequency = 'yearly'
					url = `${BASE_URL}/legal/${p.slug}`
					break
				case 'post':
					priority = 0.7
					changeFrequency = 'monthly'
					url = `${BASE_URL}/blog/${p.slug}`
					break
				default:
					continue
			}
			sitemap.push({
				lastModified: p._updatedAt || new Date(),
				priority,
				changeFrequency,
				url
			})
		}
	}

	return sitemap
}
