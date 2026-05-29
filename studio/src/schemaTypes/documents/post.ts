import { DocumentTextIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const post = defineType({
  name: 'post',
  title: 'Post',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Unikalny identyfikator używany w URL.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Treść',
      type: 'blockContent',
    }),
    defineField({
      name: 'excerpt',
      title: 'Streszczenie',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Obrazek główny',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Tekst alternatywny',
          description: 'Ważne dla SEO i dostępności.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Wymagane, gdy obrazek jest obecny.'
              }
              return true
            })
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data publikacji',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'tags',
      title: 'Tagi',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria',
      description: 'Dodatkowe obrazy wyświetlane poniżej głównej treści posta.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            aiAssist: { imageDescriptionField: 'alt' },
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Tekst alternatywny',
              description: 'Ważne dla SEO i dostępności.',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Podpis',
            }),
          ],
        },
      ],
    })
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
    },
    prepare({ title, media, date }) {
      const subtitles = [date && `on ${format(parseISO(date), 'LLL d, yyyy')}`].filter(Boolean)

      return { title, media, subtitle: subtitles.join(' ') }
    },
  },
})
