'use client'

import { trackEvent } from '@/lib/analytics/gtag'
import { useEffect } from 'react'

/**
 * Tracks every `tel:` and `mailto:` click on the site.
 *
 * Uses a single delegated listener instead of per-link handlers so links rendered from
 * Sanity (Portable Text, page builder) are covered too, and no component needs to know
 * about analytics. Capture phase — the event is recorded even if a handler further down
 * stops propagation.
 */
export function ContactLinkTracker() {
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			const target = event.target as Element | null
			const link = target?.closest?.('a[href^="tel:"], a[href^="mailto:"]')
			if (!(link instanceof HTMLAnchorElement)) return

			const href = link.getAttribute('href') ?? ''
			const isPhone = href.startsWith('tel:')

			trackEvent(isPhone ? 'click_phone' : 'click_email', {
				link_url: href,
				link_text: link.textContent?.trim().slice(0, 100) || undefined
			})
		}

		document.addEventListener('click', onClick, { capture: true })
		return () => document.removeEventListener('click', onClick, { capture: true })
	}, [])

	return null
}
