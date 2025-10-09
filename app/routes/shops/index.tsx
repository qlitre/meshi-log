import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getShops } from '../../libs/microcms'
import { Container } from '../../components/Container'
import type { Meta } from '../../types/meta'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  const { contents: shops } = await getShops({ client })

  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/`
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
        <h1 class="text-3xl font-bold">お店一覧</h1>
        <a
          href="/shops/map"
          class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          地図で見る
        </a>
      </div>

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
                <p>
                  <span class="font-medium">エリア: </span>
                  {shop.area.name}
                </p>

                <p>
                  <span class="font-medium">ジャンル: </span>
                  {shop.genre.name}
                </p>

                {shop.memo && <p class="mt-3 text-gray-700 line-clamp-2">{shop.memo}</p>}
              </div>
            </a>
          ))}
        </div>
      )}
    </Container>,
    { meta }
  )
})
