'use client'

import Link from 'next/link'
import slugify from 'slugify'

type TocItem = { title: string; anchor?: { current?: string } }
export default function InfoToc({ items }: { items: TocItem[] }) {
	return (
		<nav className='sticky top-32 hidden lg:block'>
			<div className='mb-2 text-sm font-medium'>Spis treści</div>
			<ul className='space-y-2 text-sm'>
				{items.map((it, idx) => {
					const id = it.anchor?.current || slugify(`${idx + 1}-${it.title}`, { lower: true })
					return (
						<li key={id}>
							<Link href={`#${id}`} className='py-1 text-muted-foreground hover:text-foreground'>
								{it.title}
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
