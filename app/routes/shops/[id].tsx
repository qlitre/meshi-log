import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShopDetail, getVisits } from '../../libs/microcms'


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
  
  return c.render(
    <div class="container mx-auto px-4 py-8">
      <title>{shop.name} - 飯ログ</title>

      {/* ナビゲーション */}
      <nav class="mb-6 flex gap-4">
        <a href="/" class="text-blue-600 hover:underline">
          ← トップページ
        </a>
        <a href="/shops" class="text-blue-600 hover:underline">
          お店一覧
        </a>
      </nav>

      {/* 店舗情報 */}
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-3xl font-bold mb-4">{shop.name}</h1>

        <div class="space-y-3 text-gray-700">
          <div class="flex items-start gap-3">
            <span class="text-xl">📍</span>
            <div>
              <p class="font-medium">住所</p>
              <p>{shop.address}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xl">🗺️</span>
            <div>
              <span class="font-medium">エリア: </span>
              {shop.area.name}
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xl">🍽️</span>
            <div>
              <span class="font-medium">ジャンル: </span>
              {shop.genre.name}
            </div>
          </div>

          {shop.rating && (
            <div class="flex items-center gap-3">
              <span class="text-xl">⭐</span>
              <div>
                <span class="font-medium">評価: </span>
                {shop.rating}
              </div>
            </div>
          )}

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
              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-xl font-bold mb-2">{visit.title}</h3>
                <p class="text-sm text-gray-600 mb-4">
                  📅 {new Date(visit.visit_date).toLocaleDateString('ja-JP')}
                </p>

                <div class="prose max-w-none" dangerouslySetInnerHTML={{ __html: visit.memo }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
