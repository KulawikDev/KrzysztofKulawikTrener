import {
	ADS_CONVERSION_LABELS,
	CONSENT_STORAGE_KEY,
	CONSENT_VERSION,
	CONSENT_SETTINGS_EVENT,
	GOOGLE_ADS_ID,
	type TrackedEvent
} from '@/config/analytics'

declare global {
	interface Window {
		dataLayer?: unknown[]
		gtag?: (...args: unknown[]) => void
	}
}

// ── Consent ───────────────────────────────────────────────────────────────────

export type ConsentChoice = {
	version: number
	/** GA4 / statystyka */
	analytics: boolean
	/** Google Ads / remarketing */
	marketing: boolean
	timestamp: string
}

/**
 * Reads the stored choice. Returns `null` when the visitor has never decided
 * (or the stored decision is from an older consent version) — that's the signal
 * to show the banner.
 */
export const readConsent = (): ConsentChoice | null => {
	if (typeof window === 'undefined') return null

	try {
		const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
		if (!raw) return null

		const parsed = JSON.parse(raw) as ConsentChoice
		if (parsed?.version !== CONSENT_VERSION) return null

		return parsed
	} catch {
		return null
	}
}

/** Persists the choice and pushes it to Consent Mode straight away. */
export const saveConsent = (choice: Pick<ConsentChoice, 'analytics' | 'marketing'>) => {
	const stored: ConsentChoice = { ...choice, version: CONSENT_VERSION, timestamp: new Date().toISOString() }

	try {
		window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored))
	} catch {
		// Private mode / storage disabled — consent still applies for this page view.
	}

	applyConsent(stored)

	return stored
}

/** Sends `consent: update` to gtag. Mirrors the bootstrap snippet in <GoogleTag />. */
export const applyConsent = ({ analytics, marketing }: Pick<ConsentChoice, 'analytics' | 'marketing'>) => {
	gtag('consent', 'update', {
		ad_storage: marketing ? 'granted' : 'denied',
		ad_user_data: marketing ? 'granted' : 'denied',
		ad_personalization: marketing ? 'granted' : 'denied',
		personalization_storage: marketing ? 'granted' : 'denied',
		analytics_storage: analytics ? 'granted' : 'denied'
	})

	// Only redact ad click identifiers while marketing consent is withheld.
	gtag('set', 'ads_data_redaction', !marketing)
}

/** Re-opens the cookie banner (e.g. from a footer link) so consent can be withdrawn. */
export const openCookieSettings = () => {
	if (typeof window === 'undefined') return
	window.dispatchEvent(new CustomEvent(CONSENT_SETTINGS_EVENT))
}

// ── Events ────────────────────────────────────────────────────────────────────

export const gtag = (...args: unknown[]) => {
	if (typeof window === 'undefined') return
	// window.gtag is defined by the bootstrap snippet before gtag.js loads, so this
	// only no-ops when the tag was stripped (blocked by an extension, tag not injected).
	window.gtag?.(...args)
}

/**
 * Sends the GA4 event and the matching Google Ads conversion in one go.
 *
 * Both fire regardless of consent state — Consent Mode handles the rest: without
 * consent Google receives cookieless pings (modelled conversions) instead of dropping
 * the hit entirely.
 */
export const trackEvent = (event: TrackedEvent, params: Record<string, unknown> = {}) => {
	gtag('event', event, params)
	gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${ADS_CONVERSION_LABELS[event]}`, ...params })
}
