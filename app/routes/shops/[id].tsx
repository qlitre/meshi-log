import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShopDetail, getVisits } from '../../libs/microcms'
import { Container } from '../../components/Container'
import { VisitListCard } from '../../components/VisitListCard'
import type { Meta } from '../../types/meta'

export default createRoute(async (c) => {
  const id = c.req.param('id')

  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  const shop = await getShopDetail({ client, contentId: id })

  // この店舗の訪問記録を取得
  const visits = await getVisits({ client, queries: { filters: `shop[equals]${id}` } })
  const visitsCount = visits.totalCount

  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/`
  const meta: Meta = {
    title: `${shop.name} - 飯ログ`,
    description: shop.memo,
    keywords: shop.name,
    canonicalUrl: canonicalUrl,
    ogpType: 'website' as const,
    ogpUrl: canonicalUrl,
  }

  return c.render(
    <Container>
      {/* 店舗情報 */}
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-3xl font-bold mb-4">{shop.name}</h1>

        <div class="space-y-3 text-gray-700">
          <div>
            <p class="font-medium">住所</p>
            <p>{shop.address}</p>
          </div>

          <div>
            <span class="font-medium">エリア: </span>
            {shop.area.name}
          </div>

          <div>
            <span class="font-medium">ジャンル: </span>
            {shop.genre.name}
          </div>

          {shop.memo && (
            <div class="mt-6">
              <p class="font-medium mb-2">メモ</p>
              <p class="whitespace-pre-wrap bg-gray-50 p-4 rounded">{shop.memo}</p>
            </div>
          )}
        </div>
      </div>

      {/* 訪問記録 */}
      <div>
        <h2 class="text-2xl font-bold mb-4">訪問記録 ({visitsCount}件)</h2>

        {visitsCount === 0 ? (
          <p class="text-gray-500">まだ訪問記録がありません</p>
        ) : (
          <div class="space-y-4">
            {visits.contents.map((visit) => (
              <VisitListCard visit={visit} />
            ))}
          </div>
        )}
      </div>
    </Container>,
    { meta }
  )
})
