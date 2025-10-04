import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisits } from '../libs/microcms'
import { jstDatetime } from '../utils/jstDatetime'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  const { contents: visits, totalCount } = await getVisits({ client,queries:{depth:2} })

  return c.render(
    <div class="container mx-auto px-4 py-8">
      <title>飯ログ - 訪問記録</title>

      {/* ヘッダー */}
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">飯ログ</h1>
        <nav class="flex gap-4">
          <a href="/" class="text-blue-600 font-semibold">
            訪問記録
          </a>
          <a href="/shops" class="text-gray-600 hover:text-blue-600">
            お店一覧
          </a>
        </nav>
      </header>

      {/* 訪問記録一覧 */}
      <div class="space-y-6">
        <h2 class="text-2xl font-bold">訪問記録 ({totalCount}件)</h2>

        {totalCount === 0 ? (
          <p class="text-gray-500">まだ訪問記録がありません</p>
        ) : (
          <div class="space-y-6">
            {visits.map((visit) => (
              <article class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <a href={`/visits/${visit.id}`}>
                  <h3 class="text-2xl font-bold mb-2 hover:text-blue-600">
                    {visit.title} - {visit.shop.name}
                  </h3>
                </a>

                <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <time class="flex items-center gap-1">
                    📅 {jstDatetime(visit.visit_date, 'YYYY年M月D日')}
                  </time>
                  <a
                    href={`/shops/${visit.shop.id}`}
                    class="flex items-center gap-1 hover:text-blue-600"
                  >
                    🏪 {visit.shop.name}
                  </a>
                  <span class="flex items-center gap-1">📍 {visit.shop.area.name}</span>
                  <span class="flex items-center gap-1">🍽️ {visit.shop.genre.name}</span>
                </div>

                <div
                  class="prose max-w-none line-clamp-3 [&_img]:hidden"
                  dangerouslySetInnerHTML={{ __html: visit.memo }}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
