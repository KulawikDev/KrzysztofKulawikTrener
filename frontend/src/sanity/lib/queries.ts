import { defineQuery } from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
`

const linkReference = /* groq */ `
  _type == "link" => {
    "post": post->slug.current,
    "legalPage": legalPage->slug.current
  }
`

export const sitemapData = defineQuery(`
  *[_type == "post" || _type == "legalPage" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const faqQuery = defineQuery(`
  *[_type == "faq"] | order(orderRank) {
    question,
    answer
  }
`)

export const servicesQuery = defineQuery(`
  *[_type == "service"] | order(order asc) {
    _id,
    name,
    label,
    image,
    icon,
    ctaLabel,
  }
`)

export const transformationsQuery = defineQuery(`
  *[_type == "transformation"] | order(_createdAt asc) {
    _id,
    name,
    age,
    durationMonths,
    imageBefore,
    imageAfter,
    stats[] { _key, label, before, after },
    description[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          "post": post->slug.current,
          "legalPage": legalPage->slug.current
        }
      }
    }
  }
`)

export const legalPageQuery = defineQuery(`
  *[_type == "legalPage" && slug.current == $slug][0]{
    _id, title, intro, lastUpdated,
    "slug": slug.current,
    sections[]{
      _key, title, collapsedByDefault, anchor,
      content
    },
    seoTitle, seoDescription,
    noIndex,
  }
`)
