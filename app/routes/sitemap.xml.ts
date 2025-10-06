import { createRoute } from 'honox/factory'
import { config } from '../siteSettings'
import type { Visit } from '../types/microcms'
import { jstDatetime } from '../utils/jstDatetime'
import { getMicroCMSClient } from '../libs/microcms'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })
  const allVisits = await client.getAllContents<Visit>({
    endpoint: 'visits',
    queries: { orders: '-visit_date' },
  })
  const urls = []
  for (const visit of allVisits) {
    const jst = jstDatetime(visit.updatedAt).split('T')[0]
    urls.push(`
      <url>
        <loc>${config.siteurl}/visits/${visit.id}</loc>
        <lastmod>${jst}</lastmod>
      </url>`)
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${config.siteurl}/</loc>
    </url>
    ${urls.join('')}
  </urlset>`
  return c.text(sitemap, 200, { 'Content-Type': 'application/xml' })
})
