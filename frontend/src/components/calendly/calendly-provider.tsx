'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { PopupModal } from 'react-calendly'

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
