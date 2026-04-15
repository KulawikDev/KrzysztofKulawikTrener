import CustomPortableText from '@/components/portable-text'
import { cn, polishPlural } from '@/lib/utils'
import { urlForImage } from '@/sanity/lib/utils'
import Image from 'next/image'
import { TransformationCardProps } from '../layout/home/transformations/client'

export function TransformationCard({
	name,
	age,
	durationMonths,
	imageBefore,
	imageAfter,
	stats = [],
	description,
	className
}: TransformationCardProps & { className?: string }) {
	const beforeImageUrl = urlForImage(imageBefore)?.width(470).height(580).fit('crop').url()
	const afterImageUrl = urlForImage(imageAfter)?.width(454).height(580).fit('crop').url()

	return (
		<div
			className={cn(
				'relative grid grid-cols-1 gap-3 overflow-hidden rounded-4xl p-3 shadow-[0px_4px_0px_0px_#252525]',
				'md:grid-cols-2',
				'lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-0',
				className
			)}>
			{/* Background gradient + noise texture */}
			<div aria-hidden='true' className='pointer-events-none absolute inset-0 rounded-4xl'>
				<div
					className='absolute inset-0 rounded-4xl'
					style={{ background: 'linear-gradient(124.6deg, #161616 11.7%, #1f1f1f 88.3%)' }}
				/>
				<div
					className='absolute inset-0 rounded-4xl opacity-25'
					style={{
						backgroundImage: "url('/images/decoration/grain.webp')",
						backgroundSize: '150px',
						backgroundPosition: 'top left'
					}}
				/>
			</div>

			{/* Before image */}
			<div className='relative z-10 order-1'>
				<div className='relative h-56 w-full overflow-hidden rounded-3xl md:h-64 lg:h-72.5 lg:w-58.75'>
					{beforeImageUrl ? (
						<Image
							src={beforeImageUrl}
							alt={imageBefore?.alt ?? `${name} przed`}
							fill
							className='object-cover'
							draggable={false}
						/>
					) : (
						<div className='size-full bg-secondary' />
					)}
				</div>
				<div className='absolute bottom-0 left-0 flex items-center justify-center rounded-tr-xl rounded-bl-3xl bg-background px-4 py-2'>
					<span className='font-heading text-xl leading-none text-secondary-foreground'>Przed</span>
				</div>
			</div>

			{/* After image */}
			<div className='relative z-10 order-2 lg:order-3'>
				<div className='relative h-56 w-full overflow-hidden rounded-3xl border border-primary/50 shadow-[-2px_2px_8px_0px_oklch(from_var(--primary)_l_c_h/0.05)] md:h-64 lg:h-72.5 lg:w-56.75'>
					{afterImageUrl ? (
						<Image
							src={afterImageUrl}
							alt={imageAfter?.alt ?? `${name} po`}
							fill
							className='object-cover'
							draggable={false}
						/>
					) : (
						<div className='size-full bg-secondary' />
					)}
				</div>
				<div className='absolute right-0 bottom-0 flex items-center justify-center rounded-tl-xl rounded-br-3xl bg-primary px-4 py-2'>
					<span className='font-heading text-xl leading-none text-primary-foreground uppercase'>Po</span>
				</div>
			</div>

			{/* Content */}
			<div className='relative z-10 order-3 flex min-h-0 min-w-0 flex-col gap-3 self-stretch p-5 md:col-span-2 lg:order-2 lg:col-span-1 lg:px-8 lg:py-6'>
				{/* Header */}
				<div className='flex flex-col gap-1'>
					<div className='w-fit rounded-full bg-background px-2 py-1'>
						<span className='font-body text-xs leading-tight text-foreground'>{age} lat</span>
					</div>
					<h3 className='font-heading text-[36px] leading-[1.15] text-secondary-foreground uppercase'>{name}</h3>
				</div>

				{/* Divider */}
				<div className='h-px w-full bg-white/10' />

				{/* Stats */}
				<div className='flex flex-col gap-6'>
					<div className='flex items-start gap-4 sm:gap-6 md:gap-8'>
						{/* Duration + stat labels column */}
						<div className='flex flex-col gap-2.5'>
							<span className='font-heading text-xl leading-[1.15] whitespace-nowrap text-secondary-foreground uppercase'>
								{durationMonths} {polishPlural('miesiąc', 'miesiące', 'miesięcy', durationMonths)}
							</span>
							{stats?.map(stat => (
								<span
									key={stat._key}
									className='font-body text-sm leading-[1.15] whitespace-nowrap text-secondary-foreground'>
									{stat.label}
								</span>
							))}
						</div>

						<div className='w-px self-stretch bg-white/10' />

						{/* Before values column */}
						<div className='flex flex-col gap-2.5'>
							<span className='font-heading text-xl leading-[1.15] whitespace-nowrap text-secondary-foreground uppercase'>
								Przed
							</span>
							{stats?.map(stat => (
								<span
									key={stat._key}
									className='font-body text-sm leading-[1.15] whitespace-nowrap text-secondary-foreground'>
									{stat.before}
								</span>
							))}
						</div>

						<div className='w-px self-stretch bg-white/10' />

						{/* After values column */}
						<div className='flex flex-col gap-2.5'>
							<span className='font-heading text-xl leading-[1.15] whitespace-nowrap text-secondary-foreground uppercase'>
								Po
							</span>
							{stats?.map(stat => (
								<span
									key={stat._key}
									className='font-body text-sm leading-[1.15] whitespace-nowrap text-secondary-foreground'>
									{stat.after}
								</span>
							))}
						</div>
					</div>

					{description && description.length > 0 && (
						<CustomPortableText
							value={description as any}
							className='max-w-71.25 text-xs! leading-[1.4]! text-secondary-foreground/75 [&_p]:text-xs [&_p]:leading-[1.4] [&_p]:text-secondary-foreground/75'
						/>
					)}
				</div>
			</div>
		</div>
	)
}
