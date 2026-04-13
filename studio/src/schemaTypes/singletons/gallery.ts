import { ImagesIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Galeria',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Elementy galerii',
      description: 'Dodaj zdjęcia i filmy. Kolejność przeciąganiem.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryImage',
          title: 'Zdjęcie',
          fields: [
            defineField({
              name: 'image',
              title: 'Zdjęcie',
              type: 'image',
              options: { hotspot: true },
              validation: rule => rule.required(),
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Tekst alternatywny',
                  type: 'string',
                  description: 'Opisz zdjęcie dla SEO i dostępności.',
                }),
              ],
            }),
            defineField({
              name: 'caption',
              title: 'Podpis',
              type: 'string',
            }),
          ],
          preview: {
            select: { media: 'image', title: 'caption' },
            prepare: ({ media, title }) => ({ title: title ?? 'Zdjęcie', media }),
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'galleryVideo',
          title: 'Video',
          fields: [
            defineField({
              name: 'video',
              title: 'Plik video',
              type: 'file',
              validation: rule => rule.required(),
            }),
            defineField({
              name: 'thumbnail',
              title: 'Miniatura (poster)',
              description: 'Wyświetlana w siatce i przed załadowaniem video.',
              type: 'image',
              options: { hotspot: true },
              validation: rule => rule.required(),
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Tekst alternatywny',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'caption',
              title: 'Podpis',
              type: 'string',
            }),
          ],
          preview: {
            select: { media: 'thumbnail', title: 'caption' },
            prepare: ({ media, title }) => ({ title: title ?? 'Video', media }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Galeria' }),
  },
})
