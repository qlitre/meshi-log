import { createRoute } from 'honox/factory'
import { config } from '../siteSettings'
import { jstDatetime } from '../utils/jstDatetime'
import { getMicroCMSClient, getAllVisits, getAllShops } from '../libs/microcms'

export default createRoute(async (c) => {
  const client = getMicroCMSClient(c)
  const allVisits = await getAllVisits({
    client: client,
    queries: { orders: '-visit_date', fields: 'id,updatedAt,shop.noindex' },
  })
  const urls = []
  for (const visit of allVisits) {
    if (visit.shop.noindex) continue
    const jst = jstDatetime(visit.updatedAt).split('T')[0]
    urls.push(`
  <url>
    <loc>${config.siteurl}/visits/${visit.id}</loc>
    <lastmod>${jst}</lastmod>
    <priority>0.8</priority>
  </url>`)
  }
  const allShops = await getAllShops({
    client: client,
    queries: { orders: '-publishedAt', fields: 'id,publishedAt,noindex' },
  })
  for (const shop of allShops) {
    if (shop.noindex) continue
    const jst = jstDatetime(shop.publishedAt).split('T')[0]
    urls.push(`
    <url>
    <loc>${config.siteurl}/shops/${shop.id}</loc>
    <lastmod>${jst}</lastmod>
    <priority>0.8</priority>
  </url>`)
  }
  const today = jstDatetime(new Date().toISOString()).split('T')[0]
  const staticPages = [
    { path: '/', priority: '1.0' },
    { path: '/shops', priority: '0.7' },
    { path: '/popular', priority: '0.7' },
    { path: '/about', priority: '0.5' },
    { path: '/privacy-policy', priority: '0.3' },
  ]
  const staticUrls = staticPages
    .map(
      ({ path, priority }) => `
  <url>
    <loc>${config.siteurl}${path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`
    )
    .join('')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${staticUrls}${urls.join('')}
</urlset>`
  return c.text(sitemap, 200, { 'Content-Type': 'application/xml' })
})
