import { defineField, defineType } from 'sanity'
import { SparklesIcon } from '@sanity/icons'
import { orderRankField } from '@sanity/orderable-document-list'

export const service = defineType({
  name: 'service',
  title: 'Usługi',
  icon: SparklesIcon,
  type: 'document',
  fields: [
    orderRankField({ type: 'service' }),
    defineField({
      name: 'name',
      title: 'Nazwa',
      description: 'Pełna nazwa usługi wyświetlana jako główny nagłówek karty',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Etykieta',
      description: 'Krótka kategoria wyświetlana nad nazwą (np. "Treningi personalne")',
      type: 'string',
      validation: (rule) => rule.required(),
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
          description: 'Ważne dla SEO i dostępności.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Ikona',
      description: 'Ikona wyświetlana na karcie usługi',
      type: 'lucide-icon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Tekst przycisku CTA',
      description:
        'Tekst widoczny po najechaniu na kartę (np. "Zarezerwuj darmową rozmowę")',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Kolejność',
      description: 'Niższy numer = wyświetlane wcześniej',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'label',
      media: 'image',
    },
  },
})
