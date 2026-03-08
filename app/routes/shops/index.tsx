import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShops, getAllShops } from '../../libs/microcms'
import { Container } from '../../components/Container'
import { PageHeading } from '../../components/PageHeading'
import { ShopListItem } from '../../components/ShopListItem'
import type { Meta } from '../../types/meta'
import { ShopFilterForm } from '../../components/ShopFilterForm'
import { buildShopFilterCondition } from '../../utils/buildShopFilterCondition'
import { Pagination } from '../../components/Pagination'
import { config } from '../../siteSettings'

export default createRoute(async (c) => {
  const client = getMicroCMSClient(c)
  const page = Number(c.req.query('page') || 1)
  const limit = config.shopPerPage
  const offset = limit * (page - 1)

  // フィルタパラメータを取得
  const searchQuery = c.req.query('q') || ''
  const areaId = c.req.query('area') || ''
  const genreId = c.req.query('genre') || ''
  const isRecommended = c.req.query('recommended') === '1'
  const filterString = buildShopFilterCondition({
    area_id: areaId,
    genre_id: genreId,
    is_recommended: isRecommended,
  })

  const shops = await getShops({
    client,
    queries: {
      q: searchQuery || undefined,
      limit: limit,
      offset: offset,
      filters: filterString.length > 0 ? filterString : undefined,
    },
  })

  const allShops = await getAllShops({
    client,
    queries: {
      depth: 1,
      fields: 'id,area,genre',
    },
  })

  const areaMap = new Map<string, { id: string; name: string; count: number }>()
  const genreMap = new Map<string, { id: string; name: string; count: number }>()

  for (const s of allShops) {
    for (const genre of s.genre) {
      const genreId = genre.id
      const genreName = genre.name
      const existing = genreMap.get(genreId)
      if (existing) {
        existing.count++
      } else {
        genreMap.set(genre.id, { id: genreId, name: genreName, count: 1 })
      }
    }
    const areaId = s.area.id
    const areaName = s.area.name
    const existing = areaMap.get(areaId)
    if (existing) {
      existing.count++
    } else {
      areaMap.set(areaId, { id: areaId, name: areaName, count: 1 })
    }
  }

  // 配列に変換してソート
  const areasWithCount = Array.from(areaMap.values()).sort((a, b) => a.id.localeCompare(b.id))
  const genresWithCount = Array.from(genreMap.values()).sort((a, b) => a.id.localeCompare(b.id))

  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/shops`
  const meta: Meta = {
    title: `お店一覧 - 飯ログ`,
    description: 'お店一覧ページ',
    keywords: '旨い店の一覧',
    canonicalUrl: canonicalUrl,
    ogpType: 'website' as const,
    ogpUrl: canonicalUrl,
  }
  const queryParams: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    if (key !== 'page') {
      queryParams[key] = value
    }
  })

  return c.render(
    <Container>
      <div class="flex justify-between items-center mb-6">
        <PageHeading>お店一覧</PageHeading>
        <a
          href="/shops/map"
          class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          地図で見る
        </a>
      </div>

      {/* 2カラムレイアウト */}
      <div class="flex flex-col md:flex-row gap-6">
        {/* 左サイドバー（検索フォーム） */}
        <aside class="md:w-80 flex-shrink-0">
          <ShopFilterForm
            areas={areasWithCount}
            genres={genresWithCount}
            initialFilters={{
              q: searchQuery,
              area: areaId,
              genre: genreId,
              isRecommended,
            }}
          />
        </aside>

        {/* 右メインエリア（リスト） */}
        <main class="flex-1 min-w-0">
          {shops.contents.length === 0 ? (
            <p class="text-gray-500">
              {searchQuery || areaId || genreId || isRecommended
                ? '検索条件に一致するお店が見つかりませんでした'
                : 'お店が登録されていません'}
            </p>
          ) : (
            <>
              <p class="text-sm text-gray-600 mb-4">{shops.totalCount}件のお店が見つかりました</p>
              <div class="space-y-4">
                {shops.contents.map((shop) => (
                  <ShopListItem shop={shop} key={shop.id} />
                ))}
              </div>
            </>
          )}
          <Pagination
            totalCount={shops.totalCount}
            limit={config.shopPerPage}
            currentPage={page}
            basePath="/shops"
            query={queryParams}
          />
        </main>
      </div>
    </Container>,
    { meta }
  )
})
