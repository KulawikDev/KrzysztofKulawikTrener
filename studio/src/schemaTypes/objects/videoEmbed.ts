import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube or Vimeo URL (e.g. https://youtu.be/abc or https://vimeo.com/123)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'caption', subtitle: 'url'},
    prepare({title, subtitle}) {
      return {
        title: title || 'Video Embed',
        subtitle: subtitle,
      }
    },
  },
})
