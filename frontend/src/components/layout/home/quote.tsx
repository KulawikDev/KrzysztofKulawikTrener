type Props = {}

export const Quote = (props: Props) => {
	return (
		<section className='flex h-dvh section-padding items-center justify-center bg-dots-32 bg-dots-foreground/10 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)] bg-fixed'>
			<h2 className='max-w-md text-center text-xl leading-normal text-balance'>
				Im dłużej coś odkładasz, tym dłużej <br /> stoisz w tym samym miejscu
			</h2>
		</section>
	)
}
