import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShops, getAreas, getGenres } from '../../libs/microcms'
import { Container } from '../../components/Container'
import { PageHeading } from '../../components/PageHeading'
import { ShopListCard } from '../../components/ShopListCard'
import type { Meta } from '../../types/meta'
import ShopFilterForm from '../../islands/ShopFilterForm'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  // フィルタパラメータを取得
  const searchQuery = c.req.query('q') || ''
  const areaId = c.req.query('area') || ''
  const genreId = c.req.query('genre') || ''
  const isRecommended = c.req.query('recommended') === '1'

  // フィルタ用のクエリを構築
  const filters: string[] = []
  if (areaId) filters.push(`area[equals]${areaId}`)
  if (genreId) filters.push(`genre[equals]${genreId}`)
  if (isRecommended) filters.push('is_recommended[equals]true')

  const { contents: shops } = await getShops({
    client,
    queries: {
      q: searchQuery || undefined,
      filters: filters.length > 0 ? filters.join('[and]') : undefined,
    },
  })

  // エリアとジャンルのマスターデータを取得
  const { contents: areas } = await getAreas({ client })
  const { contents: genres } = await getGenres({ client })

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

      {shops.length === 0 ? (
        <p class="text-gray-500">
          {searchQuery || areaId || genreId || isRecommended
            ? '検索条件に一致するお店が見つかりませんでした'
            : 'お店が登録されていません'}
        </p>
      ) : (
        <>
          <p class="text-sm text-gray-600 mb-4">{shops.length}件のお店が見つかりました</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopListCard shop={shop} />
            ))}
          </div>
        </>
      )}
    </Container>,
    { meta }
  )
})
