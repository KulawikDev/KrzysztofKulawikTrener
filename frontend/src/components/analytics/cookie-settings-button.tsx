'use client'

import { openCookieSettings } from '@/lib/analytics/gtag'

/** Lets visitors re-open the cookie banner to change or withdraw consent. */
export function CookieSettingsButton({ className }: { className?: string }) {
	return (
		<button type='button' onClick={openCookieSettings} className={className}>
			Ustawienia cookies
		</button>
	)
}
