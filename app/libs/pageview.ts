import type { Visit } from '../types/microcms'

export type PopularPage = {
  page_path: string
  content_id: string
  page_type: string
  title: string
  thumbnail_url: string
  shop_name: string
  total_count: number
}

type PageViewParams = {
  db: D1Database
  pagePath: string
  contentId: string
  pageType: string
  visit: Visit
}

export const getPopularPages = async (db: D1Database, limit = 10): Promise<PopularPage[]> => {
  const result = await db
    .prepare(
      `SELECT page_path, content_id, page_type, title, thumbnail_url, shop_name, total_count
       FROM popular_pages
       WHERE page_type = 'visit'
       ORDER BY total_count DESC
       LIMIT ?`
    )
    .bind(limit)
    .all<PopularPage>()
  return result.results
}

export const recordPageView = async ({
  db,
  pagePath,
  contentId,
  pageType,
  visit,
}: PageViewParams) => {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toISOString()

  await db.batch([
    // daily_pages: 日別カウントをupsert
    db
      .prepare(
        `INSERT INTO daily_pages (page_path, content_id, page_type, date, count)
         VALUES (?, ?, ?, ?, 1)
         ON CONFLICT(page_path, date) DO UPDATE SET count = count + 1`
      )
      .bind(pagePath, contentId, pageType, today),

    // popular_pages: 累計カウントをupsert + メタ情報更新
    db
      .prepare(
        `INSERT INTO popular_pages (page_path, content_id, page_type, title, thumbnail_url, shop_name, total_count, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)
         ON CONFLICT(page_path) DO UPDATE SET
           total_count = total_count + 1,
           title = excluded.title,
           thumbnail_url = excluded.thumbnail_url,
           shop_name = excluded.shop_name,
           updated_at = excluded.updated_at`
      )
      .bind(
        pagePath,
        contentId,
        pageType,
        visit.title,
        visit.thumbnail?.url ?? '',
        visit.shop?.name ?? '',
        now
      ),
  ])
}
