import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShops, getAllAreas, getAllGenres } from '../../libs/microcms'
import { Container } from '../../components/Container'
import { PageHeading } from '../../components/PageHeading'
import { ShopListCard } from '../../components/ShopListCard'
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

  // エリアとジャンルのマスターデータを取得
  const areas = await getAllAreas({ client: client, queries: { orders: 'code' } })
  const genres = await getAllGenres({ client: client, queries: { orders: 'name' } })

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

      <ShopFilterForm
        areas={areas}
        genres={genres}
        initialFilters={{
          q: searchQuery,
          area: areaId,
          genre: genreId,
          isRecommended,
        }}
      />

      {shops.contents.length === 0 ? (
        <p class="text-gray-500">
          {searchQuery || areaId || genreId || isRecommended
            ? '検索条件に一致するお店が見つかりませんでした'
            : 'お店が登録されていません'}
        </p>
      ) : (
        <>
          <p class="text-sm text-gray-600 mb-4">{shops.totalCount}件のお店が見つかりました</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.contents.map((shop) => (
              <ShopListCard shop={shop} />
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
    </Container>,
    { meta }
  )
})
