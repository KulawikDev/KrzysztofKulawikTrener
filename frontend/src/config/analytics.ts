/**
 * Google tagging configuration.
 *
 * - The Google Ads tag (AW-…) is always loaded — it powers Ads conversion tracking.
 * - GA4 (G-…) is configured on the same tag, but only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
 *
 * Conversion labels come from the Ads account (Cele → Konwersje → szczegóły tagu).
 */

export const GOOGLE_ADS_ID = 'AW-18369388175'

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/** GA4 event name → Google Ads conversion label */
export const ADS_CONVERSION_LABELS = {
	/** Kliknięcie w telefon */
	click_phone: 'PsTfCIrmqdwcEI-9mrdE',
	/** Rezerwacja konsultacji (Calendly) */
	book_appointment: 'zvdPCPT9vdwcEI-9mrdE',
	/** Kliknięcie w email */
	click_email: 'na2cCMWWvtwcEI-9mrdE',
	/** Formularz kontaktowy */
	generate_lead: 'voqWCJyEqtwcEI-9mrdE'
} as const

export type TrackedEvent = keyof typeof ADS_CONVERSION_LABELS

/** localStorage key holding the visitor's Consent Mode v2 choice */
export const CONSENT_STORAGE_KEY = 'kk_cookie_consent'

/** Bump to re-prompt every visitor (e.g. after adding a new vendor) */
export const CONSENT_VERSION = 1

/** Fired on `window` to re-open the cookie banner from anywhere */
export const CONSENT_SETTINGS_EVENT = 'kk:cookie-settings'
