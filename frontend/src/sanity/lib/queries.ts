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
