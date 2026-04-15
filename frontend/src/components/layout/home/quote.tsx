type Props = {}

export const Quote = (props: Props) => {
	return (
		<section className='z-0 flex h-dvh section-padding items-center justify-center bg-dots-32 bg-dots-foreground/10 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_110%)] bg-fixed md:mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]'>
			<h2 className='z-20 max-w-xs text-center text-lg leading-normal text-balance md:max-w-md md:text-xl'>
				Im dłużej coś odkładasz, tym dłużej <br /> stoisz w tym samym miejscu
			</h2>
		</section>
	)
}
