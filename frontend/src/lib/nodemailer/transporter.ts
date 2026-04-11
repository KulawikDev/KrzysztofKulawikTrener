import nodemailer from 'nodemailer'

export const mailTransporter = nodemailer.createTransport({
	host: process.env.NODEMAILER_HOST || 'host713477.hostido.net.pl',
	port: parseInt(process.env.NODEMAILER_PORT || '587') || 587,
	// secure: true,
	tls: { rejectUnauthorized: false },
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD
	}
})
