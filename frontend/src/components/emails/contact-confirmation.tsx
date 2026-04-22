import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Hr,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import { emailConfig } from './email-theme'
import { EmailHeader } from './email-header'
import { siteConfig } from '@/config/site'

const CALENDLY_URL = 'https://calendly.com/trener-krzysztof-kulawik/konsultacja'

type Props = {
	name: string
	message: string
}

export const ContactConfirmationEmail = ({ name, message }: Props) => (
	<Tailwind config={emailConfig}>
		<Html lang='pl' dir='ltr'>
			<Head />
			<Preview>Otrzymaliśmy Twoją wiadomość, {name}. Odezwiemy się wkrótce.</Preview>
			<Body className='bg-em-bg m-0 p-0 font-sans'>
				<EmailHeader
					title={`Cześć \n${name}`}
					subtitle='Twoja wiadomość dotarła, odezwę się wkrótce.'
					titleColor='#FFC902'
				/>

				<Container className='mx-auto max-w-150 px-6 pb-14'>
					{/* ── Card ── */}
					<Section className='bg-em-card border-em-border mt-7 rounded-xl border'>
						<Row>
							<Column className='px-9 pt-8 pb-8'>
								{/* Body copy - spans for inline colour without nested <p> */}
								<Text className='m-0 text-[15px] leading-[1.8] text-[#C0C0C0]'>
									Zazwyczaj odpowiadam w ciągu <span style={{ color: '#FFC902', fontWeight: 700 }}>24 godzin</span>.{' '}
									Jeśli sprawa jest pilna, zadzwoń bezpośrednio na numer{' '}
									<span style={{ color: '#EBEBEB', fontWeight: 600 }}>{siteConfig.phone}</span>.
								</Text>

								<Hr className='border-em-border mt-7 mb-7' />

								{/* Message recap */}
								<Text className='m-0 mb-3 text-[10px] tracking-[2px] text-[#666666] uppercase'>Twoja wiadomość</Text>
								<Section className='bg-em-surface border-em-border rounded-md border px-5 py-4'>
									<Text className='m-0 text-[14px] leading-[1.8] text-[#999999]'>{message}</Text>
								</Section>

								<Hr className='border-em-border mt-7 mb-7' />

								{/* CTA */}
								<Text className='m-0 mb-2 text-[17px] font-bold text-[#EBEBEB]'>Chcesz szybciej zacząć?</Text>
								<Text className='m-0 mb-7 text-[14px] leading-[1.7] text-[#AAAAAA]'>
									Umów się na bezpłatną rozmowę - porozmawiamy o Twoich celach i sprawdzimy, czy jesteśmy dobrym
									dopasowaniem.
								</Text>

								<Section className='text-center'>
									<Button
										href={CALENDLY_URL}
										className='bg-em-yellow inline-block rounded-md px-10 py-3.5 text-[12px] font-black tracking-[0.5px] text-black no-underline'>
										Umów bezpłatną konsultację
									</Button>
									<Text className='m-0 mt-4 text-[12px] text-[#666666]'>
										Bez zobowiązań. Rozmowa trwa ok. 20 minut.
									</Text>
								</Section>
							</Column>
						</Row>
					</Section>

					{/* ── Footer ── */}
					<Section className='border-em-border mt-8 border-t pt-7'>
						<Row className='mb-5'>
							<Column className='text-center align-top'>
								<Text className='m-0 mb-1 text-[9px] tracking-[2px] text-[#555555] uppercase'>Telefon</Text>
								<Text className='m-0 text-[12px] text-[#AAAAAA]'>{siteConfig.phone}</Text>
							</Column>
							<Column className='text-center align-top'>
								<Text className='m-0 mb-1 text-[9px] tracking-[2px] text-[#555555] uppercase'>E-mail</Text>
								<Text className='m-0 text-[12px] text-[#AAAAAA]'>{siteConfig.email}</Text>
							</Column>
							<Column className='text-center align-top'>
								<Text className='m-0 mb-1 text-[9px] tracking-[2px] text-[#555555] uppercase'>Strona</Text>
								<Text className='m-0 text-[12px] text-[#AAAAAA]'>krzysztofkulawik.pl</Text>
							</Column>
						</Row>
						<Text className='m-0 mt-2 text-center text-[11px] leading-[1.6] text-[#444444]'>
							Otrzymujesz tę wiadomość, ponieważ wypełniłeś/aś formularz kontaktowy na stronie krzysztofkulawik.pl.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
)
