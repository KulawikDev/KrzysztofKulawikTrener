'use client'

import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

type Props = {
	children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
	return (
		<GoogleReCaptchaProvider language='pl' reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
			{children}
		</GoogleReCaptchaProvider>
	)
}
