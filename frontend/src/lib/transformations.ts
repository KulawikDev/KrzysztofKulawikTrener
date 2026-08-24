import type { PortableTextBlock } from 'next-sanity'

// ── Stat deltas ───────────────────────────────────────────────────────────────

type ParsedStat = { value: number; unit: string }

/** `"82,5 kg"` → `{ value: 82.5, unit: 'kg' }`. Returns null when there's no leading number. */
const parseStatValue = (raw?: string | null): ParsedStat | null => {
	const match = raw?.trim().match(/^([+-]?\d+(?:[.,]\d+)?)\s*(.*)$/)
	if (!match) return null

	const value = Number(match[1].replace(',', '.'))
	if (!Number.isFinite(value)) return null

	return { value, unit: match[2].trim() }
}

/** Polish decimal notation, without a trailing `,0`. */
const formatNumber = (value: number) => {
	const rounded = Math.round(value * 10) / 10
	return String(rounded).replace('.', ',')
}

/**
 * Difference between the "before" and "after" values, ready to render as a badge.
 *
 * Returns null whenever the two values can't be compared — free-text stats, mismatched
 * units ("85 kg" vs "70") or no measurable change — so the badge is simply omitted
 * instead of showing something wrong.
 */
export const getStatDelta = (before?: string | null, after?: string | null): string | null => {
	const from = parseStatValue(before)
	const to = parseStatValue(after)

	if (!from || !to || from.unit !== to.unit) return null

	const diff = to.value - from.value
	if (Math.abs(diff) < 0.05) return null

	const sign = diff > 0 ? '+' : '-'
	// "%" reads better tight against the number, every other unit gets a space.
	const unit = from.unit ? (from.unit === '%' ? '%' : ` ${from.unit}`) : ''

	return `${sign}${formatNumber(Math.abs(diff))}${unit}`
}

// ── Portable Text ─────────────────────────────────────────────────────────────

/**
 * Flattens Portable Text to a single string.
 *
 * The card shows a clamped teaser of the description — clamping the rendered blocks
 * would depend on `-webkit-line-clamp` behaving across nested <p> elements, so the
 * preview uses plain text and the modal renders the real thing.
 */
export const portableTextToPlain = (blocks?: PortableTextBlock[] | null): string =>
	(blocks ?? [])
		.filter(block => block._type === 'block')
		.map(block =>
			((block.children as { text?: string }[] | undefined) ?? []).map(child => child.text ?? '').join('')
		)
		.join(' ')
		.trim()
