import {faq} from './documents/faq'
import {legalPage} from './documents/legalPage'
import {post} from './documents/post'
import {service} from './documents/service'
import {transformation} from './documents/transformation'
import {blockContent} from './objects/blockContent'
import {infoSection} from './objects/infoSection'
import {link} from './objects/link'
import {settings} from './singletons/settings'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  post,
  faq,
  legalPage,
  service,
  transformation,
  // Objects
  blockContent,
  link,
  infoSection,
]
