import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShops } from '../../libs/microcms'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  const { contents: shops } = await getShops({ client })

  return c.render(
    <div class="container mx-auto px-4 py-8">
      <title>お店一覧 - 飯ログ</title>

      {/* ナビゲーション */}
      <nav class="mb-6">
        <a href="/" class="text-blue-600 hover:underline">← 訪問記録一覧に戻る</a>
      </nav>

      <h1 class="text-3xl font-bold mb-6">お店一覧</h1>

      {shops.length === 0 ? (
        <p class="text-gray-500">お店が登録されていません</p>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <a
              href={`/shops/${shop.id}`}
              class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h2 class="text-xl font-semibold mb-2">{shop.name}</h2>

              <div class="space-y-2 text-sm text-gray-600">
                <p class="flex items-center gap-2">
                  <span class="font-medium">📍</span>
                  {shop.area.name}
                </p>

                <p class="flex items-center gap-2">
                  <span class="font-medium">🍽️</span>
                  {shop.genre.name}
                </p>

                {shop.rating && (
                  <p class="flex items-center gap-2">
                    <span class="font-medium">⭐</span>
                    {shop.rating}
                  </p>
                )}

                {shop.memo && (
                  <p class="mt-3 text-gray-700 line-clamp-2">{shop.memo}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
})
