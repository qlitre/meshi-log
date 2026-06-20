import { getMicroCMSClient, getAllVisits } from './microcms'
import type { Context } from 'hono'

export const rebuildShopVisitCounts = async (c: Context): Promise<void> => {
  const client = getMicroCMSClient(c)
  const allVisits = await getAllVisits({ client, queries: { fields: 'shop.id', depth: 1 } })

  const counts: Record<string, number> = {}
  for (const v of allVisits) {
    const shopId = v.shop.id
    if (!counts[shopId]) counts[shopId] = 0
    counts[shopId]++
  }

  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM shop_visit_counts'),
    ...Object.entries(counts).map(([shopId, count]) =>
      c.env.DB.prepare('INSERT INTO shop_visit_counts (shop_id, count) VALUES (?, ?)').bind(
        shopId,
        count
      )
    ),
  ])
}

export const getRepeatedVisitShopIds = async (db: D1Database): Promise<string[]> => {
  const rows = await db
    .prepare('SELECT shop_id FROM shop_visit_counts WHERE count >= 2')
    .all<{ shop_id: string }>()
  return rows.results.map((r) => r.shop_id)
}
