import { createRoute } from 'honox/factory'
import { config } from '../siteSettings'
import { jstDatetime } from '../utils/jstDatetime'
import { getMicroCMSClient, getAllVisits } from '../libs/microcms'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })
  const allVisits = await getAllVisits({ client: client, queries: { orders: '-visit_date' } })
  const urls = []
  for (const visit of allVisits) {
    const jst = jstDatetime(visit.updatedAt).split('T')[0]
    urls.push(`
  <url>
    <loc>${config.siteurl}/visits/${visit.id}</loc>
    <lastmod>${jst}</lastmod>
    <priority>0.8</priority>
  </url>`)
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${config.siteurl}/</loc>
    <lastmod>${jstDatetime(new Date().toISOString()).split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>${urls.join('')}
</urlset>`
  return c.text(sitemap, 200, { 'Content-Type': 'application/xml' })
})
