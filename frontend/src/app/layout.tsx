import './globals.css'

import DraftModeToast from '@/components/draft-mode-toast'
import { Footer } from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import { Providers } from '@/components/layout/providers'
import { StructuredData } from '@/components/structured-data'
import { siteConfig } from '@/config/site'
import { BASE_URL } from '@/lib/base-url'
import { OrganisationSchema, WebsiteSchema } from '@/lib/structuredData'
import { SanityLive } from '@/sanity/lib/live'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { VisualEditing } from 'next-sanity/visual-editing'
import { Bebas_Neue, Inter, Libre_Baskerville, Poppins } from 'next/font/google'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { handleError } from './client-utils'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({}: {}): Promise<Metadata> {
	const {
		metadata: {
			default: { description, title }
		},
		name
	} = siteConfig

	return {
		title: {
			default: title,
			template: `%s | ${name}`
		},
		metadataBase: new URL(BASE_URL),
		description: description,
		keywords: [],
		openGraph: {
			title: `${title} | ${name}`,
			description: description,
			url: BASE_URL,
			type: 'website',
			locale: 'pl'
		},
		twitter: {
			title: `${title} | ${name}`,
			description: description,
			card: 'summary_large_image',
			images: [`${BASE_URL}/opengraph-image.png`]
		}
	}
}

export const viewport: Viewport = {
	colorScheme: 'light',
	themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }]
}

const heading = Bebas_Neue({
	subsets: ['latin-ext'],
	variable: '--font-heading',
	weight: '400',
	display: 'swap'
})
const body = Libre_Baskerville({
	subsets: ['latin-ext'],
	variable: '--font-body',
	weight: ['400', '700'],
	display: 'swap'
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const { isEnabled: isDraftMode } = await draftMode()

	return (
		<html lang='pl' className={`${body.variable} ${heading.variable}`}>
			<body>
				<Toaster />
				{isDraftMode && (
					<>
						<DraftModeToast />
						{/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
						<VisualEditing />
					</>
				)}
				<SanityLive onError={handleError} />

				<Providers>
					<>
						<Suspense>
							<Navbar />
						</Suspense>

						{children}

						<Suspense>
							<Footer />
						</Suspense>
					</>
				</Providers>

				<Analytics />
				<SpeedInsights />

				{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
					<GoogleAnalytics
						debugMode
						gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
						data-category='analytics'
						data-service='Google Analytics'
					/>
				)}

				<StructuredData data={WebsiteSchema()} />
				<StructuredData data={OrganisationSchema()} />
			</body>
		</html>
	)
}
