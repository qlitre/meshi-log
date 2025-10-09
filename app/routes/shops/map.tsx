// app/routes/shops/map.tsx
import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getAllShops } from '../../libs/microcms'
import { Container } from '../../components/Container'
import { AllShopsMap } from '../../components/AllShopsMap'
import type { Meta } from '../../types/meta'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  // 全店舗を取得（座標フィールドも含める）
  const shops = await getAllShops({
    client,
    queries: {
      fields: 'id,name,address,latitude,longitude,area,genre',
      limit: 1000, // 全店舗取得
    },
  })

  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/shops/map`

  const meta: Meta = {
    title: `店舗マップ - 飯ログ`,
    description: '訪問した全店舗を地図上で確認できます',
    keywords: '店舗マップ,飯ログ,地図',
    canonicalUrl: canonicalUrl,
    ogpType: 'website' as const,
    ogpUrl: canonicalUrl,
  }

  return c.render(
    <Container>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold">店舗マップ</h1>
          <a href="/shops" class="text-blue-600 hover:text-blue-800 hover:underline">
            リスト表示に戻る →
          </a>
        </div>

        <AllShopsMap shops={shops} />

        {/* エリア別・ジャンル別の統計情報 */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">エリア別店舗数</h2>
            <div class="space-y-2">
              {Array.from(new Set(shops.map((s) => s.area.name)))
                .map((area) => ({
                  name: area,
                  count: shops.filter((s) => s.area.name === area).length,
                }))
                .sort((a, b) => b.count - a.count)
                .map(({ name, count }) => (
                  <div class="flex justify-between items-center">
                    <span>{name}</span>
                    <span class="font-semibold">{count}店舗</span>
                  </div>
                ))}
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">ジャンル別店舗数</h2>
            <div class="space-y-2">
              {Array.from(new Set(shops.map((s) => s.genre.name)))
                .map((genre) => ({
                  name: genre,
                  count: shops.filter((s) => s.genre.name === genre).length,
                }))
                .sort((a, b) => b.count - a.count)
                .map(({ name, count }) => (
                  <div class="flex justify-between items-center">
                    <span>{name}</span>
                    <span class="font-semibold">{count}店舗</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Container>,
    { meta }
  )
})
