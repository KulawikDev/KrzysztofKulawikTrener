import {defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faq = defineType({
  name: 'faq',
  title: 'Często zadawane pytania',
  icon: HelpCircleIcon,
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Pytanie',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Odpowiedź',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle?.substring(0, 50) + (subtitle?.length > 50 ? '...' : ''),
      }
    },
  },
})
