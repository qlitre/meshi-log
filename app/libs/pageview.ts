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

type SeedPageViewMetaParams = {
  db: D1Database
  pagePath: string
  contentId: string
  pageType: string
  visit: Visit
}

type IncrementPageViewParams = {
  db: D1Database
  contentId: string
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

/**
 * popular_pages にメタ情報（title/サムネ/店名）のみを seed/更新する。
 * カウントは増やさない（カウントはクライアントビーコンが担う）。
 * microCMS由来の信頼値のみを書き込むため、サーバーレンダリング時に呼ぶ。
 */
export const seedPageViewMeta = async ({
  db,
  pagePath,
  contentId,
  pageType,
  visit,
}: SeedPageViewMetaParams) => {
  const now = new Date().toISOString()
  await db
    .prepare(
      `INSERT INTO popular_pages (page_path, content_id, page_type, title, thumbnail_url, shop_name, total_count, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?)
       ON CONFLICT(page_path) DO UPDATE SET
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
    )
    .run()
}

/**
 * クライアントビーコンからのPVカウント加算。
 * seed済み（popular_pagesに存在する）ページのみ加算し、未知idは no-op。
 * これにより forged id によるゴミ行挿入・経路汚染を構造的に防ぐ。
 * pagePath はサーバー側で組み立て、クライアントの文字列は信用しない。
 */
export const incrementPageView = async ({ db, contentId }: IncrementPageViewParams) => {
  const pagePath = `/visits/${contentId}`
  const seeded = await db
    .prepare('SELECT 1 FROM popular_pages WHERE page_path = ?')
    .bind(pagePath)
    .first()
  if (!seeded) return false

  const today = new Date().toISOString().split('T')[0]
  await db.batch([
    // daily_pages: 日別カウントをupsert
    db
      .prepare(
        `INSERT INTO daily_pages (page_path, content_id, page_type, date, count)
         VALUES (?, ?, 'visit', ?, 1)
         ON CONFLICT(page_path, date) DO UPDATE SET count = count + 1`
      )
      .bind(pagePath, contentId, today),

    // popular_pages: 既存行の累計カウントのみ加算（メタは触らない）
    db
      .prepare('UPDATE popular_pages SET total_count = total_count + 1 WHERE page_path = ?')
      .bind(pagePath),
  ])
  return true
}
