import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShopDetail, getVisits } from '../../libs/microcms'
import { Container } from '../../components/Container'
import { VisitListCard } from '../../components/VisitListCard'
import { config } from '../../siteSettings'
import { Pagination } from '../../components/Pagination'
import type { Meta } from '../../types/meta'
import { getShopGenreString } from '../../utils/getShopGenreString'

export default createRoute(async (c) => {
  const id = c.req.param('id') || ''
  const client = getMicroCMSClient(c)
  const shop = await getShopDetail({ client, contentId: id })
  const page = Number(c.req.query('page') || 1)
  const limit = config.visitWithShopPerPage
  const offset = limit * (page - 1)
  const visits = await getVisits({
    client,
    queries: {
      limit: limit,
      depth: 2,
      offset: offset,
      filters: `shop[equals]${id}`,
      fields: 'id,title,thumbnail,visit_date,memo,shop.name,shop.area.name,shop.genre.name',
    },
  })
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
    noindex: shop.noindex,
  }

  return c.render(
    <Container>
      {/* 店舗情報 */}
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-3xl font-bold mb-4">{shop.name}</h1>

        <div class="space-y-3 text-gray-700">
          <div>
            <span class="font-medium">ジャンル: </span>
            {getShopGenreString(shop.genre)}
          </div>

          <div>
            <span class="font-medium">エリア: </span>
            {shop.area.name}
          </div>

          {shop.nearest_station && (
            <div>
              <span class="font-medium">最寄駅: </span>
              {shop.nearest_station}
            </div>
          )}

          <div>
            <p class="font-medium">住所</p>
            <p>{shop.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Googleマップで開く
            </a>
            <div class="mt-2">
              <iframe
                width="100%"
                height="300"
                style="border:0; border-radius: 0.5rem;"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&output=embed`}
              ></iframe>
            </div>
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
      <Pagination
        totalCount={visitsCount}
        limit={config.visitWithShopPerPage}
        currentPage={page}
        basePath={`/shops/${id}`}
      ></Pagination>
    </Container>,
    { meta }
  )
})
