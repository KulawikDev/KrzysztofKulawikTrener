/**
 * Shared-element ids for the card → modal transition. Both sides must derive them from the
 * same base, otherwise Framer has nothing to morph between and the modal just fades in.
 */
export const transformationIds = (base: string) => ({
	root: base,
	header: `${base}-header`,
	before: `${base}-before`,
	after: `${base}-after`,
	stat: (key: string) => `${base}-stat-${key}`
})
