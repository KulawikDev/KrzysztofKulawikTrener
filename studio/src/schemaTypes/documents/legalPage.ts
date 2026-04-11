import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Strony informacyjne',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Zawartość', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'noIndex',
      type: 'boolean',
      title: 'Nie indeksuj tej strony',
      description:
        'Zaznacz, jeśli nie chcesz, aby ta strona pojawiała się w wynikach wyszukiwania.',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tytuł',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {source: 'title', maxLength: 96},
      description: 'Unikalny identyfikator, używany w URL',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'intro',
      title: 'Wprowadzenie (opcjonalne)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Sekcje',
      type: 'array',
      group: 'content',
      of: [{type: 'infoSection'}],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Ostatnia aktualizacja',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'content',
    }),
    // SEO (prosty)
    defineField({
      name: 'seoTitle',
      type: 'string',
      title: 'Tytuł SEO',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      title: 'Opis SEO',
      rows: 3,
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}` : '(Brak slugu)',
      }
    },
  },
})
