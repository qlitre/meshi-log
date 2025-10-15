import { createRoute } from 'honox/factory'
import { config } from '../siteSettings'
import { jstDatetime } from '../utils/jstDatetime'
import { getMicroCMSClient, getVisits } from '../libs/microcms'
import { stripHtmlTagsAndTruncate } from '../utils/stripHtmlTags'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })
  const limit = config.feedPerPage
  const r = await getVisits({
    client,
    queries: {
      limit: limit,
      fields: 'id,title,updatedAt,createdAt,memo',
    },
  })
  const baseUrl = config.siteurl
  const feedItems: string[] = []
  for (const visit of r.contents) {
    feedItems.push(` <entry>
      <title>${visit.title}</title>
      <link href="${baseUrl}/visits/${visit.id}" />
      <id>${baseUrl}/visits/${visit.id}</id>
      <updated>${jstDatetime(visit.updatedAt)}</updated>
      <published>${jstDatetime(visit.publishedAt)}</published>
      <summary>
        ${stripHtmlTagsAndTruncate(visit.memo, 100)}
      </summary>
    </entry>`)
  }
  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>${config.siteTitle}</title>
    <link href="${baseUrl}/feed.atom" rel="self"/>
    <link href="${baseUrl}/"/>
    <id>${baseUrl}/</id>
    <updated>${jstDatetime(new Date().toISOString())}</updated>
    ${feedItems.join('')}
  </feed>`
  return c.text(atomFeed, 200, { 'Content-Type': 'atom+xml' })
})
