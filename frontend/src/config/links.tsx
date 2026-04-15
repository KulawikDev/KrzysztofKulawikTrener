export type NavigationLink = {
	label: string
	href: string
	external?: boolean
}

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
