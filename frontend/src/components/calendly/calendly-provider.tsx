'use client'

import { trackEvent } from '@/lib/analytics/gtag'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { PopupModal, useCalendlyEventListener } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/trener-krzysztof-kulawik/konsultacja'

type CalendlyContextType = {
	openCalendly: () => void
}

const CalendlyContext = createContext<CalendlyContextType | null>(null)

export function useCalendly() {
	const ctx = useContext(CalendlyContext)
	if (!ctx) throw new Error('useCalendly must be used within CalendlyProvider')
	return ctx
}

export function CalendlyProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)
	const [root, setRoot] = useState<HTMLElement | null>(null)

	useEffect(() => {
		setRoot(document.body)
	}, [])

	const openCalendly = useCallback(() => setIsOpen(true), [])

	// Calendly runs in an iframe — the only signal a booking went through is the
	// 'calendly.event_scheduled' postMessage, which this hook listens for.
	useCalendlyEventListener({
		onEventScheduled: () => trackEvent('book_appointment', { method: 'calendly' })
	})

	return (
		<CalendlyContext.Provider value={{ openCalendly }}>
			{children}
			{root && (
				<PopupModal
					url={CALENDLY_URL}
					rootElement={root}
					open={isOpen}
					onModalClose={() => setIsOpen(false)}
				/>
			)}
		</CalendlyContext.Provider>
	)
}
