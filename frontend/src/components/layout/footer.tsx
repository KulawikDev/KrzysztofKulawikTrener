import { siteConfig } from '@/config/site'
import { FOOTER_LINKS } from '@/config/links'
import Link from 'next/link'

type Props = {}

export const Footer = (props: Props) => {
	const year = new Date().getFullYear() ?? 2025

	return (
		<footer className='grid-container container-fill space-y-4 bg-secondary pt-16 pb-6'>
			<div className='z-10 overflow-hidden py-8 text-secondary-foreground'>
				<div className='grid grid-cols-1 gap-x-12 gap-y-8 pt-2 sm:grid-cols-[auto_auto] md:justify-between lg:grid-cols-[1fr_auto_auto_auto] lg:gap-x-24'>
					{FOOTER_LINKS.map((group, index) => (
						<div key={index} className='max-lg:last:-order-1'>
							<h3 className='mb-2 text-base font-semibold'>{group.title}</h3>
							<ul className='space-y-1 font-medium'>
								{group.links.map((link, index) => (
									<li key={index}>
										{link.href ? (
											<Link href={link.href} className='[&:not(:has(.not-link-underline))]:link-underline-slide'>
												{link.prefix && <span className='font-semibold'>{link.prefix}</span>}
												<span>{link.label}</span>
											</Link>
										) : (
											<p>
												{link.prefix && <span className='font-semibold'>{link.prefix}</span>}
												<span>{link.label}</span>
											</p>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className='mt-8 flex flex-col justify-between md:mt-0 md:flex-row md:items-center'>
					<p className='text-sm'>
						{year} © {siteConfig.name}
					</p>
					<p className='text-sm'>
						Wykonanie:{' '}
						<Link href='https://mateuszhada.com' target='_blank' className='hover:underline'>
							Mateusz Hada
						</Link>
					</p>
				</div>
			</div>
		</footer>
	)
}
