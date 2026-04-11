'use client'

import { cn } from '@/lib/utils'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import * as React from 'react'
import H2 from '../ui/typography/h2'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { MinusIcon, PlusIcon } from 'lucide-react'

type FaqItem = {
	_key?: string
	question: string
	answer: PortableTextBlock[] | string
}

type Accent = 'emerald' | 'sky' | 'violet' | 'blue' | 'teal' | 'rose' | 'amber' | 'primary' | 'secondary' | 'tertiary'

const accentMap: Record<Accent, { bg: string; text: string; bgActive: string; textActive: string }> = {
	// Custom themes
	primary: { bg: 'bg-primary/10', text: 'text-primary', bgActive: 'bg-primary/20', textActive: 'text-primary' },
	secondary: {
		bg: 'bg-secondary/10',
		text: 'text-secondary',
		bgActive: 'bg-secondary/20',
		textActive: 'text-secondary'
	},
	tertiary: { bg: 'bg-tertiary/10', text: 'text-tertiary', bgActive: 'bg-tertiary/20', textActive: 'text-tertiary' },

	// Default themes
	emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', bgActive: 'bg-emerald-600', textActive: 'text-white' },
	sky: { bg: 'bg-sky-100', text: 'text-sky-700', bgActive: 'bg-sky-600', textActive: 'text-white' },
	violet: { bg: 'bg-violet-100', text: 'text-violet-700', bgActive: 'bg-violet-600', textActive: 'text-white' },
	blue: { bg: 'bg-blue-100', text: 'text-blue-700', bgActive: 'bg-blue-600', textActive: 'text-white' },
	teal: { bg: 'bg-teal-100', text: 'text-teal-700', bgActive: 'bg-teal-600', textActive: 'text-white' },
	rose: { bg: 'bg-rose-100', text: 'text-rose-700', bgActive: 'bg-rose-600', textActive: 'text-white' },
	amber: { bg: 'bg-amber-100', text: 'text-amber-700', bgActive: 'bg-amber-600', textActive: 'text-white' }
}

export interface FaqProps {
	title?: React.ReactNode
	items: FaqItem[]
	columns?: 1 | 2
	accent?: Accent
	className?: string
	cardClassName?: string // customize the pill/card
}

export default function Faq({
	title = 'Często Zadawane Pytania',
	items,
	columns = 2,
	accent = 'emerald',
	className,
	cardClassName
}: FaqProps) {
	const [left, right] = columns === 2 ? splitEveryOther(items) : [items, []]
	const acc = accentMap[accent]

	return (
		<section className={cn('section-padding', className)}>
			{title ? <H2 className='mb-12'>{title}</H2> : null}

			<div className={cn('grid gap-4 md:gap-6', columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
				<Column items={left} accent={acc} cardClassName={cardClassName} />
				{columns === 2 ? <Column items={right} accent={acc} cardClassName={cardClassName} /> : null}
			</div>
		</section>
	)
}

function Column({
	items,
	accent,
	cardClassName,
	type = 'single'
}: {
	items: FaqItem[]
	accent: ReturnType<typeof getAccent> | (typeof accentMap)[keyof typeof accentMap]
	cardClassName?: string
	type?: 'single' | 'multiple'
}) {
	return (
		<Accordion type={type} collapsible className='space-y-3'>
			{items.map((it, idx) => (
				<AccordionItem key={it._key ?? idx} value={it._key ?? String(idx)} className={cardClassName}>
					<AccordionTrigger
						indicatorClassName={cn(
							accent.bg,
							accent.text,
							'group-data-[state=open]:' + accent.bgActive,
							'group-data-[state=open]:' + accent.textActive
						)}>
						<span className='pr-2'>{it.question}</span>
					</AccordionTrigger>

					<AccordionContent>
						{Array.isArray(it.answer) ? <PortableText value={it.answer} /> : <p>{it.answer}</p>}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

function splitEveryOther<T>(arr: T[]): [T[], T[]] {
	const left: T[] = []
	const right: T[] = []
	arr.forEach((item, i) => (i % 2 === 0 ? left : right).push(item))
	return [left, right]
}

// Small helper so TS understands the accent map shape (used above)
function getAccent(a: Accent) {
	return accentMap[a]
}


// Custom shadcn-ui accordion

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return <AccordionPrimitive.Root data-slot='accordion' {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot='accordion-item'
			className={cn(
				'rounded-2xl border bg-surface shadow-sm transition-shadow duration-300 active:inset-shadow-sm active:shadow-transparent',
				className
			)}
			{...props}
		/>
	)
}

function AccordionTrigger({
	className,
	children,
	indicatorClassName,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
	indicatorClassName?: string
}) {
	return (
		<AccordionPrimitive.Header className='flex'>
			<AccordionPrimitive.Trigger
				data-slot='accordion-trigger'
				className={cn(
					'group flex flex-1 cursor-pointer items-center justify-between gap-4 rounded-md px-4 py-4 text-left text-base font-medium text-surface-foreground transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					className
				)}
				{...props}>
				{children}

				<span
					className={cn(
						'relative grid size-9 place-items-center rounded-lg bg-secondary/25 text-primary transition-colors',
						indicatorClassName
					)}>
					<PlusIcon className='pointer-events-none absolute size-4 opacity-100 transition-opacity group-data-[state=open]:opacity-0' />
					<MinusIcon className='pointer-events-none size-4 opacity-0 transition-opacity group-data-[state=open]:opacity-100' />
				</span>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	)
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			data-slot='accordion-content'
			className='overflow-hidden text-sm leading-relaxed data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
			{...props}>
			<div className={cn('px-4 pb-4', className)}>{children}</div>
		</AccordionPrimitive.Content>
	)
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }

