import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisitDetail } from '../../libs/microcms'
import type { Meta } from '../../types/meta'
import { jstDatetime } from '../../utils/jstDatetime'
import { ArticleDetail } from '../../components/ArticleDetail'
import { ShareX } from '../../components/ShareX'
import { Container } from '../../components/Container'

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
    <Container>
      <title>
        {visit.title} - {visit.shop.name} - 飯ログ
      </title>

      {/* 記事ヘッダー */}
      <article class="article-detail mb-8">
        <h1 class="text-4xl font-bold mb-4">{visit.title} - {visit.shop.name}</h1>
        <div class="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
          <time>{jstDatetime(visit.visit_date, 'YYYY年M月D日')}</time>
          <a href={`/shops/${visit.shop.id}`} class="hover:text-blue-600">
            {visit.shop.name}
          </a>
          <span>{visit.shop.area.name}</span>
          <span>{visit.shop.genre.name}</span>
        </div>

        {/* 本文 */}
        <ArticleDetail content={visit.memo}/>

        {/* シェアボタン */}
        <div class="mt-8 pt-6 border-t">
          <ShareX url={canonicalUrl} title={`${visit.title} - ${visit.shop.name}`} />
        </div>
      </article>

      {/* 店舗情報 */}
      <div class="bg-gray-50 rounded-lg p-6 max-w-[860px] mx-auto">
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
    </Container>,{meta}
  )
})
