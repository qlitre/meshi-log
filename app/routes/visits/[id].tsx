import { createRoute } from 'honox/factory'
import {
  getMicroCMSClient,
  getVisitDetail,
  getPrevVisits,
  getNextVisits,
} from '../../libs/microcms'
import type { Meta } from '../../types/meta'
import { jstDatetime } from '../../utils/jstDatetime'
import { stripHtmlTagsAndTruncate } from '../../utils/stripHtmlTags'
import { ArticleDetail } from '../../components/ArticleDetail'
import { ShareX } from '../../components/ShareX'
import { Container } from '../../components/Container'
import { LinkToTop } from '../../components/LinkToTop'
import { ShopInformation } from '../../components/ShopInformation'

export default createRoute(async (c) => {
  const id = c.req.param('id') || ''
  const client = getMicroCMSClient(c)
  const visit = await getVisitDetail({ client, contentId: id, queries: { depth: 2 } })

  const description = stripHtmlTagsAndTruncate(visit.memo, 100)
  const publishedAt = visit.publishedAt || ''
  const nextVisits = await getNextVisits({ client, publishedAt })
  const prevVisits = await getPrevVisits({ client, publishedAt })
  const hasNext = nextVisits.totalCount > 0
  const hasPrev = prevVisits.totalCount > 0
  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/visits/${id}`

  const meta: Meta = {
    title: `${visit.title} - ${visit.shop.name} - 飯ログ`,
    description: description,
    keywords: visit.shop.name,
    canonicalUrl: canonicalUrl,
    ogpType: 'article' as const,
    ogpImage: visit.thumbnail?.url,
    ogpUrl: canonicalUrl,
  }

  return c.render(
    <Container>
      {/* 記事ヘッダー */}
      <article class="article-detail mb-8">
        <h1 class="text-2xl font-bold mb-4">
          {visit.title} - {visit.shop.name}
        </h1>
        <div class="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
          <time>{jstDatetime(visit.visit_date, 'YYYY年M月D日')}</time>
          <span>{visit.shop.area.name}</span>
          <span>{visit.shop.genre.name}</span>
        </div>

        {/* 本文 */}
        <ArticleDetail content={visit.memo} />

        {/* シェアボタン */}
        <div class="mt-8 pt-6 border-t">
          <ShareX url={canonicalUrl} title={`${visit.title} - ${visit.shop.name}`} />
        </div>
      </article>

      {/* 店舗情報 */}
      <ShopInformation shop={visit.shop} />
      <nav class="my-8 flex flex-col md:flex-row md:justify-between items-stretch gap-4 border-t border-b py-4">
        <div class="flex-1 px-2">
          {hasNext ? (
            <a
              href={`/visits/${nextVisits.contents[0].id}`}
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              <div class="text-sm text-gray-500">← 次の記事</div>
              <div class="font-medium">{nextVisits.contents[0].title}</div>
            </a>
          ) : (
            <div class="text-gray-400">
              <div class="text-sm">← 次の記事</div>
              <div class="font-medium">なし</div>
            </div>
          )}
        </div>
        <div class="flex-1 px-2 md:text-right">
          {hasPrev ? (
            <a
              href={`/visits/${prevVisits.contents[0].id}`}
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              <div class="text-sm text-gray-500">前の記事 →</div>
              <div class="font-medium">{prevVisits.contents[0].title}</div>
            </a>
          ) : (
            <div class="text-gray-400">
              <div class="text-sm">前の記事 →</div>
              <div class="font-medium">なし</div>
            </div>
          )}
        </div>
      </nav>
      {/* 戻るリンク */}
      <LinkToTop />
    </Container>,
    { meta }
  )
})
