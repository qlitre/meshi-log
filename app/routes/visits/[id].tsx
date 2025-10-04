import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisitDetail } from '../../libs/microcms'
import type { Meta } from '../../types/meta'
import { jstDatetime } from '../../utils/jstDatetime'

export default createRoute(async (c) => {
  const id = c.req.param('id')

  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  const visit = await getVisitDetail({ client, contentId: id,queries:{depth:2} })

  // HTMLタグを除去してテキストのみ抽出
  const plainText = visit.memo.replace(/<[^>]*>/g, '').trim()
  const description = plainText.slice(0, 100)

  // 現在のURLを取得
  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/visits/${id}`

  const meta: Meta = {
    title: `${visit.title} - ${visit.shop.name}`,
    description,
    keywords: visit.shop.name,
    canonicalUrl,
    ogpType: 'article' as const,
    ogpImage: visit.thumbnail?.url,
    ogpUrl: canonicalUrl,
  }

  return c.render(
    <div class="container mx-auto px-4 py-8">
      <title>
        {visit.title} - {visit.shop.name} - 飯ログ
      </title>

      {/* ナビゲーション */}
      <nav class="mb-6 flex gap-4">
        <a href="/" class="text-blue-600 hover:underline">
          ← トップページ
        </a>
        <a href="/shops" class="text-blue-600 hover:underline">
          お店一覧
        </a>
        <a href={`/shops/${visit.shop.id}`} class="text-blue-600 hover:underline">
          {visit.shop.name}
        </a>
      </nav>

      {/* 記事ヘッダー */}
      <article class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-4xl font-bold mb-4">{visit.title} - {visit.shop.name}</h1>
        <div class="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
          <time class="flex items-center gap-2">
            <span class="text-xl">📅</span>
            {jstDatetime(visit.visit_date, 'YYYY年M月D日')}
          </time>
          <a href={`/shops/${visit.shop.id}`} class="flex items-center gap-2 hover:text-blue-600">
            <span class="text-xl">🏪</span>
            {visit.shop.name}
          </a>
          <span class="flex items-center gap-2">
            <span class="text-xl">📍</span>
            {visit.shop.area.name}
          </span>
          <span class="flex items-center gap-2">
            <span class="text-xl">🍽️</span>
            {visit.shop.genre.name}
          </span>
        </div>

        {/* 本文 */}
        <div class="prose max-w-none" dangerouslySetInnerHTML={{ __html: visit.memo }} />
      </article>

      {/* 店舗情報 */}
      <div class="bg-gray-50 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">店舗情報</h2>
        <div class="space-y-3">
          <div>
            <p class="font-medium text-gray-700">店名</p>
            <p class="text-lg">{visit.shop.name}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">住所</p>
            <p>{visit.shop.address}</p>
          </div>
          {visit.shop.rating && (
            <div>
              <p class="font-medium text-gray-700">評価</p>
              <p class="flex items-center gap-2">
                <span>⭐</span>
                {visit.shop.rating}
              </p>
            </div>
          )}
          <div class="pt-4">
            <a
              href={`/shops/${visit.shop.id}`}
              class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              この店舗の他の訪問記録を見る
            </a>
          </div>
        </div>
      </div>
    </div>,{meta}
  )
})
