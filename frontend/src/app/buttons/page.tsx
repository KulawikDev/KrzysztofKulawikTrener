import { BlobButton, FlipButton, GlitchButton, MagneticButton, RippleButton } from '@/components/ui/button-effects'

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
	return (
		<div className='flex flex-col gap-5 rounded-2xl border border-border bg-secondary/40 p-8'>
			<div className='flex min-h-36 flex-1 items-center justify-center'>{children}</div>
			<div>
				<p className='font-heading text-xl uppercase tracking-wider'>{title}</p>
				<p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>{description}</p>
			</div>
		</div>
	)
}

export default function ButtonsPage() {
	return (
		<main className='min-h-screen px-6 py-24 md:py-32'>
			<div className='mx-auto max-w-5xl'>
				<header className='mb-16'>
					<p className='font-heading text-base uppercase tracking-widest text-primary'>Playground</p>
					<h1 className='font-heading text-[clamp(40px,8vw,96px)] uppercase leading-[0.9] tracking-tight'>
						Interakcje
						<br />
						Przyciski
					</h1>
					<p className='mt-4 max-w-sm text-muted-foreground'>
						Pięć kreatywnych animacji hover i active dla wariantu domyślnego
					</p>
				</header>

				<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
					<Card title='Magnetyczny' description='Przyciąga się ku kursorowi z fizyką sprężyny — cofa po wyjściu myszy'>
						<MagneticButton>Zacznij dziś</MagneticButton>
					</Card>

					<Card title='Obrót 3D' description='Tekst obraca się w osi X przy hoverze, odsłaniając nowy komunikat'>
						<FlipButton hoverLabel='Gotowy?'>Umów darmową rozmowę</FlipButton>
					</Card>

					<Card title='Fala' description='Kliknięcie tworzy falę ekspansji wychodzącej z punktu kontaktu'>
						<RippleButton>Umów darmową rozmowę</RippleButton>
					</Card>

					<Card title='Morfing' description='Krawędzie organicznie zmieniają kształt w płynny blob przy hoverze'>
						<BlobButton>Zacznij dziś</BlobButton>
					</Card>

					<Card title='Glitch' description='Chromatic aberration i drgania — cyfrowy efekt glitchu przy hoverze'>
						<GlitchButton>Glitch!</GlitchButton>
					</Card>
				</div>
			</div>
		</main>
	)
}
