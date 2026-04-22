import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Row,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import { emailConfig } from './email-theme'
import { BASE_URL } from '@/lib/base-url'
import { siteConfig } from '@/config/site'

type Props = {
	name: string
	email: string
	message: string
	phone?: string
}

export const ContactNotificationEmail = ({ name, email, message, phone }: Props) => (
	<Tailwind config={emailConfig}>
		<Html lang='pl' dir='ltr'>
			<Head />
			<Preview>
				Nowe zapytanie od {name} — {email}
			</Preview>
			<Body className='bg-em-bg m-0 p-0 font-sans'>
				{/* ── Header ── */}
				<Section
					className='border-b-2 border-[#FFC902] text-center'
					style={{
						backgroundColor: '#191919',
						backgroundImage: `url(https://krzysztofkulawik.pl/images/pattern.png)`,
						backgroundRepeat: 'repeat'
					}}>
					<Row>
						<Column className='px-10 pt-12 pb-10'>
							<Img
								src={`${BASE_URL}/assets/wordmark-white.png`}
								alt='Krzysztof Kulawik'
								width={148}
								height={62}
								className='mx-auto mb-7 block'
							/>
							<Text className='m-0 mb-5 text-[10px] tracking-[3px] text-[#555555] uppercase'>Formularz kontaktowy</Text>
							<Text className='m-0 text-[38px] leading-[1.1] font-black tracking-[-1px] text-[#EBEBEB]'>
								Nowe{'\n'}zapytanie
							</Text>
							<Text className='m-0 mt-4 text-[14px] text-[#AAAAAA]'>
								Ktoś skontaktował się przez formularz na stronie.
							</Text>
						</Column>
					</Row>
				</Section>

				<Container className='mx-auto max-w-[600px] px-6 pb-14'>
					{/* ── Card ── */}
					<Section className='bg-em-card border-em-border mt-7 rounded-xl border'>
						<Row>
							<Column className='px-9 pt-8 pb-8'>
								{/* Fields */}
								<Row className='mb-[14px]'>
									<Column className='w-[110px] align-top'>
										<Text className='m-0 mt-0.5 text-[11px] tracking-[0.5px] text-[#666666] uppercase'>Imię</Text>
									</Column>
									<Column>
										<Text className='m-0 text-[14px] font-medium text-[#EBEBEB]'>{name}</Text>
									</Column>
								</Row>

								<Row className='mb-[14px]'>
									<Column className='w-[110px] align-top'>
										<Text className='m-0 mt-0.5 text-[11px] tracking-[0.5px] text-[#666666] uppercase'>E-mail</Text>
									</Column>
									<Column>
										<Text className='m-0 text-[14px] font-medium text-[#EBEBEB]'>{email}</Text>
									</Column>
								</Row>

								{phone && (
									<Row className='mb-[14px]'>
										<Column className='w-[110px] align-top'>
											<Text className='m-0 mt-0.5 text-[11px] tracking-[0.5px] text-[#666666] uppercase'>Telefon</Text>
										</Column>
										<Column>
											<Text className='m-0 text-[14px] font-medium text-[#EBEBEB]'>{phone}</Text>
										</Column>
									</Row>
								)}

								<Hr className='border-em-border mt-4 mb-6' />

								{/* Message */}
								<Text className='m-0 mb-3 text-[10px] tracking-[2px] text-[#666666] uppercase'>Wiadomość</Text>
								<Section
									className='bg-em-surface mb-8 rounded-md px-5 py-4'
									style={{ borderLeft: '3px solid #FFC902' }}>
									<Text className='m-0 text-[14px] leading-relaxed text-[#C0C0C0]'>{message}</Text>
								</Section>

								{/* CTA */}
								<Section className='pb-1 text-center'>
									<Button
										href={`mailto:${email}?subject=Odpowied%C5%BA%20na%20Twoje%20zapytanie`}
										className='bg-em-yellow inline-block rounded-md px-10 py-[14px] text-[12px] font-black tracking-[0.5px] text-black no-underline'>
										Odpowiedz na wiadomość →
									</Button>
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
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
)
