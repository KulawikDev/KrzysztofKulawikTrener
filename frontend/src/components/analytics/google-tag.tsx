import { CONSENT_STORAGE_KEY, CONSENT_VERSION, GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from '@/config/analytics'
import Script from 'next/script'

/**
 * Consent Mode v2 bootstrap.
 *
 * Rendered as a plain inline <script> (not next/script) so it runs while the HTML is
 * still being parsed — i.e. strictly before gtag.js loads. Google requires the
 * `consent: default` call to be the first thing on the dataLayer, otherwise the first
 * hits of the page view are sent with full storage regardless of the banner.
 *
 * A previously stored decision is replayed as `consent: update` immediately, so returning
 * visitors are not throttled by `wait_for_update`.
 */
const consentBootstrap = `
(function () {
	window.dataLayer = window.dataLayer || [];
	function gtag() { window.dataLayer.push(arguments); }
	window.gtag = gtag;

	gtag('consent', 'default', {
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied',
		personalization_storage: 'denied',
		analytics_storage: 'denied',
		functionality_storage: 'granted',
		security_storage: 'granted',
		wait_for_update: 500
	});

	gtag('set', 'ads_data_redaction', true);
	gtag('set', 'url_passthrough', true);

	try {
		var stored = JSON.parse(window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) || 'null');
		if (stored && stored.version === ${CONSENT_VERSION}) {
			gtag('consent', 'update', {
				ad_storage: stored.marketing ? 'granted' : 'denied',
				ad_user_data: stored.marketing ? 'granted' : 'denied',
				ad_personalization: stored.marketing ? 'granted' : 'denied',
				personalization_storage: stored.marketing ? 'granted' : 'denied',
				analytics_storage: stored.analytics ? 'granted' : 'denied'
			});
			gtag('set', 'ads_data_redaction', !stored.marketing);
		}
	} catch (e) {}
})();
`

const tagInit = `
	gtag('js', new Date());
	gtag('config', ${JSON.stringify(GOOGLE_ADS_ID)});
	${GA_MEASUREMENT_ID ? `gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)});` : ''}
`

/**
 * Google tag (gtag.js) — one library instance serving both the Ads account and GA4.
 * Loaded on every page via the root layout.
 *
 * This is Consent Mode in its *advanced* form: the tag loads regardless of the banner, so
 * before a visitor chooses anything GA4 and Ads still receive cookieless pings — no
 * identifiers, no `_ga`/`_gcl` cookies written. That is what feeds GA4's behavioural
 * modelling and Ads' conversion modelling. The basic form (withholding the tag until
 * consent) collects nothing at all from anyone who ignores the banner, which is why it is
 * not used here.
 *
 * Sequence for a first-time visitor: `consent default` (everything denied except
 * functionality/security) → `ads_data_redaction: true` → `url_passthrough: true`, then hits
 * flow once `wait_for_update` (500ms) elapses. A stored decision is replayed as
 * `consent update` inside the same script, so returning visitors never wait on it.
 */
export function GoogleTag() {
	return (
		<>
			<script id='google-consent-mode' dangerouslySetInnerHTML={{ __html: consentBootstrap }} />

			<Script
				id='google-tag'
				strategy='afterInteractive'
				src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
			/>

			<Script id='google-tag-init' strategy='afterInteractive' dangerouslySetInnerHTML={{ __html: tagInit }} />
		</>
	)
}
