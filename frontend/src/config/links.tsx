import { BookOpenIcon, FileTextIcon, LucideIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import Wordmark from '~/public/assets/wordmark.png'
import { composedAddress, siteConfig } from './site'

export type NavigationLink = {
	label: string
	href: string
	external?: boolean
}

export const FOOTER_LINKS: {
	title: string | React.JSX.Element
	links: { label: string | React.JSX.Element; prefix?: string; href?: string }[]
}[] = [
	{
		title: (
			<p>
				<Image
					src={Wordmark}
					alt={`Logo ${siteConfig.name}`}
					unoptimized={true}
					priority
					quality={100}
					className='h-16 w-auto'
				/>
			</p>
		),
		links: []
	},
	{
		title: 'Strona',
		links: [
			{ label: 'Home', href: '/' },
			{ label: 'Blog', href: '/blog' },
			{ label: 'Polityka prywatności', href: '/legal/polityka-prywatnosci' },
			{ label: 'Regulamin', href: '/legal/regulamin' }
		]
	},
	{
		title: 'Social Media',
		links: Object.values(siteConfig.socials).map(({ label, value, icon: Icon }, i) => ({
			label: (
				<span className='not-link-underline flex items-center gap-2'>
					<Icon className='size-4' />
					<span className='link-underline-slide'>{label}</span>
				</span>
			),
			href: value
		}))
	},
	{
		title: siteConfig.name,
		links: [
			{ prefix: 'NIP: ', label: siteConfig.nip },
			{
				label: (
					<span className='block'>
						<span className='block'>{composedAddress.split(',')[0]}</span>
						<span className='block'>{composedAddress.split(',')[1]}</span>
					</span>
				)
			}
		]
	}
]

export const NAVBAR_LINKS: NavigationLink[] = [
	{
		label: 'Oferta',
		href: '/#oferta'
	},
	{
		label: 'Opinie',
		href: '/#opinie'
	},
	{
		label: 'Blog',
		href: '/blog'
	}
]
