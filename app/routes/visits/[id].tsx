import { createRoute } from 'honox/factory'
import {
  getMicroCMSClient,
  getVisitDetail,
  getPrevVisits,
  getNextVisits,
} from '../../libs/microcms'
import { recordPageView } from '../../libs/pageview'
import type { Meta } from '../../types/meta'
import { jstDatetime } from '../../utils/jstDatetime'
import { stripHtmlTagsAndTruncate } from '../../utils/stripHtmlTags'
import { ArticleDetail } from '../../components/ArticleDetail'
import { ShareX } from '../../components/ShareX'
import { Container } from '../../components/Container'
import { LinkToTop } from '../../components/LinkToTop'
import { ShopInformation } from '../../components/ShopInformation'
import { AdjacentPosts } from '../../components/AdjacentPosts'

export default createRoute(async (c) => {
  const id = c.req.param('id') || ''
  const client = getMicroCMSClient(c)
  const visit = await getVisitDetail({ client, contentId: id, queries: { depth: 2 } })

  const description = stripHtmlTagsAndTruncate(visit.memo, 100)
  const publishedAt = visit.publishedAt || ''
  const nextVisits = await getNextVisits({ client, publishedAt })
  const prevVisits = await getPrevVisits({ client, publishedAt })
  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/visits/${id}`

  // ページビュー記録（レスポンスをブロックしない）
  c.executionCtx.waitUntil(
    recordPageView({
      db: c.env.DB,
      pagePath: `/visits/${id}`,
      contentId: id,
      pageType: 'visit',
      visit,
    })
  )

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
      <AdjacentPosts nextVisits={nextVisits.contents} prevVisits={prevVisits.contents} />
      {/* 戻るリンク */}
      <LinkToTop />
    </Container>,
    { meta }
  )
})
