import { urlForImage } from '@/sanity/lib/utils'
import { DynamicIcon } from 'lucide-react/dynamic'
import Image from 'next/image'

type ServiceData = {
	_id: string
	name: string
	label: string
	image: any
	icon: string
	ctaLabel: string
}

export function ServiceCard({ name, label, image, icon, ctaLabel }: ServiceData) {
	const imageUrl = urlForImage(image)?.width(560).height(748).fit('crop').url()

	return (
		<div className='group flex h-auto min-h-56 cursor-pointer flex-col rounded-4xl bg-secondary p-2 transition-colors duration-300 hover:bg-primary md:h-93.5 md:flex-row'>
			{/* Content */}
			<div className='flex flex-1 flex-col justify-between p-6'>
				{/* Icon / CTA pill */}
				<div className='flex w-auto max-w-11 items-center gap-0 rounded-[3rem] bg-primary p-3 transition-all duration-300 group-hover:max-w-max group-hover:gap-4 group-hover:rounded-xl group-hover:bg-primary-foreground'>
					<DynamicIcon
						name={icon as any}
						className='size-5 shrink-0 text-primary-foreground transition-colors duration-300 group-hover:text-primary'
					/>
					<span className='h-0 max-w-0 overflow-hidden font-heading text-base leading-none! tracking-[0.03em] whitespace-nowrap text-primary transition-all duration-300 group-hover:h-auto group-hover:max-w-75'>
						{ctaLabel.toUpperCase()}
					</span>
				</div>

				{/* Text */}
				<div className='flex flex-col-reverse gap-3'>
					<h3 className='font-heading text-[clamp(28px,2.8vw,40px)] leading-[1.05] text-balance text-foreground uppercase transition-colors duration-300 group-hover:text-primary-foreground'>
						{name}
					</h3>
					<h4 className='font-heading text-xl leading-none text-foreground/50 uppercase transition-colors duration-300 group-hover:text-primary-foreground/80'>
						{label}
					</h4>
				</div>
			</div>

			{/* Image panel — desktop only */}
			<div
				className='relative hidden shrink-0 overflow-hidden rounded-3xl border border-primary/25 md:block'
				style={{ width: '280px' }}>
				{imageUrl ? (
					<Image src={imageUrl} alt={image?.alt ?? name} fill className='object-cover' draggable={false} />
				) : (
					<div className='size-full bg-muted' />
				)}
				{/* Golden tint */}
				<div className='absolute inset-0 bg-primary/15 mix-blend-overlay' />
				{/* Grain */}
				<div
					className='absolute inset-0 opacity-10'
					style={{
						backgroundImage: "url('/images/decoration/grain.png')",
						backgroundSize: '150px'
					}}
				/>
			</div>
		</div>
	)
}
