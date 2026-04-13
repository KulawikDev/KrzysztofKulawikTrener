import { UserIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'Sekcja "O mnie"',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'photos',
      title: 'Zdjęcia (slideshow)',
      description: 'Jedno lub więcej zdjęć portretowych (proporcje ~3:4). Zmieniają się automatycznie.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Tekst alternatywny',
              type: 'string',
              description: 'Ważne dla SEO i dostępności.',
            }),
          ],
        }),
      ],
      validation: rule => rule.required().min(1),
    }),
    defineField({
      name: 'certificates',
      title: 'Certyfikaty',
      description:
        'Pierwsze 4 wyświetlane są na stronie jako miniatury. Wszystkie dostępne po kliknięciu (lightbox).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Certyfikat',
          fields: [
            defineField({
              name: 'image',
              title: 'Zdjęcie certyfikatu',
              type: 'image',
              options: { hotspot: true },
              validation: rule => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Etykieta',
              type: 'string',
              description: 'np. "Certyfikat trenera personalnego FBF"',
              validation: rule => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              media: 'image',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Sekcja "O mnie"' }
    },
  },
})
