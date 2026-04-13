import { StarIcon } from '@sanity/icons'
import { orderRankField } from '@sanity/orderable-document-list'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Opinie',
  type: 'document',
  icon: StarIcon,
  fields: [
    orderRankField({ type: 'testimonial' }),
    defineField({
      name: 'name',
      title: 'Imię i nazwisko',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Opinia',
      description: 'Treść opinii (rich text).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: { decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Italic', value: 'em' }], annotations: [] },
        }),
      ],
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Tekst alternatywny',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Ocena (1–5 gwiazdek)',
      type: 'number',
      initialValue: 5,
      validation: rule => rule.required().min(1).max(5).integer(),
      options: {
        list: [1, 2, 3, 4, 5].map(n => ({ title: '★'.repeat(n), value: n })),
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
