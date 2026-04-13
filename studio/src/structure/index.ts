import { CogIcon, ImagesIcon, UserIcon } from '@sanity/icons'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { ComponentType } from 'react'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

// Must set an icon if using orderable: true
const GROUPED_TYPES: {
  name: string
  label: string
  orderable?: boolean
  singleton?: boolean
  icon?: ComponentType
}[][] = [
    [
      { name: 'post', label: 'Artykuły' },
      { name: 'transformation', label: 'Transformacje' },
      { name: 'service', label: 'Usługi', orderable: true },
      { name: 'testimonial', label: 'Opinie', orderable: true },
    ],
    [
      { name: 'settings', label: 'Ustawienia strony', singleton: true, icon: CogIcon },
      { name: 'about', label: 'Sekcja "O mnie"', singleton: true, icon: UserIcon },
      { name: 'gallery', label: 'Galeria', singleton: true, icon: ImagesIcon },
    ],
    [
      { name: 'faq', label: 'Często zadawane pytania' },
      { name: 'legalPage', label: 'Strony prawne' },
    ],
  ]

const DISALLOWED_TYPES = ['assist.instruction.context', 'metaPages']

export const structure: StructureResolver = (S: StructureBuilder, context) =>
  S.list()
    .title('Website Content')
    .items([
      ...GROUPED_TYPES.flatMap((group, index) => {
        const items = group.map(({ name, label, orderable, singleton, icon }) => {
          if (singleton) {
            // Handle singleton documents
            return S.listItem()
              .title(label)
              .child(S.document().schemaType(name).documentId(name))
              .icon(icon)
          }
          if (orderable) {
            // Handle orderable documents
            return orderableDocumentListDeskItem({
              type: name,
              title: label,
              S,
              context,
              icon: icon,
            })
          }
          // Handle regular document type lists
          return S.documentTypeListItem(name).title(label)
        })
        // Add a divider between groups, but not after the last group
        if (index < GROUPED_TYPES.length - 1) {
          items.push(S.divider() as any)
        }
        return items
      }),
      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          !GROUPED_TYPES.flat()
            .map(({ name }) => name)
            .includes(listItem.getId() as string) &&
          !DISALLOWED_TYPES.includes(listItem.getId() || ''),
      ),
    ])
