'use client'

import { Slot } from '@radix-ui/react-slot'
import { useCalendly } from './calendly-provider'

/**
 * Wraps any single interactive element and opens the Calendly popup on click.
 * Uses Slot so no extra DOM node is added — props are merged into the child.
 *
 * Usage:
 *   <CalendlyButton>
 *     <Button>Umów rozmowę</Button>
 *   </CalendlyButton>
 */
export function CalendlyButton({ children }: { children: React.ReactNode }) {
	const { openCalendly } = useCalendly()
	return <Slot onClick={openCalendly}>{children}</Slot>
}
