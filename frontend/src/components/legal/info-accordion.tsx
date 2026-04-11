'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useMemo, useState } from 'react'
import CustomPortableText from '../portable-text'
import slugify from 'slugify'

type Section = {
	_key: string
	title: string | null
	collapsedByDefault?: boolean | null
	anchor?: { current?: string } | null
	content: any
}

export default function InfoAccordion({ sections }: { sections: Section[] }) {
	const defaultValues = useMemo(() => sections.filter(s => s.collapsedByDefault === false).map(s => s._key), [sections])

	const [value, setValue] = useState<string[] | string>(defaultValues)

	return (
		<Accordion type='multiple' value={value as string[]} onValueChange={setValue} className='w-full'>
			{sections.map((s, idx) => {
				const id = s.anchor?.current || slugify(`${idx + 1}-${s.title}`, { lower: true })
				return (
					<AccordionItem key={s._key} value={s._key} className='scroll-m-24 border-b' id={id}>
						<AccordionTrigger className='cursor-pointer py-6 text-left text-base md:text-lg [&>svg]:size-5'>
							{s.title}
						</AccordionTrigger>
						<AccordionContent className='pb-6'>
							<CustomPortableText value={s.content} />
						</AccordionContent>
					</AccordionItem>
				)
			})}
		</Accordion>
	)
}
