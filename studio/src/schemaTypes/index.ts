import { faq } from './documents/faq'
import { legalPage } from './documents/legalPage'
import { post } from './documents/post'
import { service } from './documents/service'
import { testimonial } from './documents/testimonial'
import { transformation } from './documents/transformation'
import { blockContent } from './objects/blockContent'
import { infoSection } from './objects/infoSection'
import { link } from './objects/link'
import { about } from './singletons/about'
import { gallery } from './singletons/gallery'
import { settings } from './singletons/settings'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  // settings,
  about,
  gallery,
  // Documents
  post,
  // faq,
  legalPage,
  service,
  testimonial,
  transformation,
  // Objects
  blockContent,
  link,
  infoSection,
]
