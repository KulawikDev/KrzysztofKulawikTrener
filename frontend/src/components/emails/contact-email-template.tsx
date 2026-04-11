import { siteConfig } from '@/config/site'

type Props = {
	name: string
	email: string
	message: string
	phone: string | undefined
}

const ContactEmailTemplate = ({ email, message, name, phone }: Props) => {
	return (
		<table
			style={{
				width: '100% !important',
				height: '100%',
				backgroundColor: '#fafafa',
				padding: '20px',
				fontFamily: "'Helvetica Neue', 'Helvetica', Helvetica, Arial, 'Lucida Grande', sans-serif",
				fontSize: '100%',
				lineHeight: 1.6
			}}>
			<tr>
				<td></td>
				<td
					style={{
						border: '1px solid #eeeeee',
						backgroundColor: '#ffffff',
						borderRadius: '5px',
						display: 'block !important',
						maxWidth: '600px !important',
						margin: '0 auto!important',
						clear: 'both'
					}}>
					<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', display: 'block' }}>
						<table style={{ width: '100%' }}>
							<tr>
								<td>
									<h1 style={{ fontWeight: 200, fontSize: '36px', margin: '20px 0 30px 0', color: '#333333' }}>
										Formularz kontaktowy
									</h1>
									<h2 style={{ fontWeight: 200, fontSize: '16px', margin: '20px 0', color: '#333333' }}>
										Imię: {name}
									</h2>
									<h2 style={{ fontWeight: 200, fontSize: '16px', margin: '20px 0', color: '#333333' }}>
										Email: {email}
									</h2>
									{phone && (
										<h2 style={{ fontWeight: 200, fontSize: '16px', margin: '20px 0', color: '#333333' }}>
											Telefon: {phone}
										</h2>
									)}
									<h2
										style={{
											fontWeight: 200,
											fontSize: '16px',
											margin: '20px 0',
											color: '#333333'
										}}>
										Wiadomość:
										<p
											style={{
												marginBottom: '10px',
												fontWeight: 'normal',
												fontSize: '16px',
												color: '#333333',
												whiteSpace: 'pre-line'
											}}>
											&quot;{message}&quot;
										</p>
									</h2>

									<p
										style={{
											textAlign: 'center',
											display: 'block',
											paddingTop: '20px',
											fontWeight: 'bold',
											marginTop: '30px',
											color: '#666666',
											borderTop: '1px solid #dddddd'
										}}>
										{siteConfig.name}
									</p>
								</td>
							</tr>
						</table>
					</div>
				</td>
				<td></td>
			</tr>
		</table>
	)
}

export default ContactEmailTemplate
