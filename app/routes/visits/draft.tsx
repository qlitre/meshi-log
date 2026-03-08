import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisitDetail } from '../../libs/microcms'
import type { Meta } from '../../types/meta'
import { jstDatetime } from '../../utils/jstDatetime'
import { ArticleDetail } from '../../components/ArticleDetail'
import { Container } from '../../components/Container'
import { ShopInformation } from '../../components/ShopInformation'
import { getShopGenreString } from '../../utils/getShopGenreString'

export default createRoute(async (c) => {
  const id = c.req.query('id') || ''
  const client = getMicroCMSClient(c)
  const draftKey = c.req.query('draftKey') || ''
  const visit = await getVisitDetail({
    client,
    contentId: id,
    queries: { depth: 2, draftKey: draftKey },
  })
  const meta: Meta = {
    title: `${visit.title} - ${visit.shop.name} - 飯ログ(下書き)`,
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
          <span>{getShopGenreString(visit.shop.genre)}</span>
        </div>
        {/* 本文 */}
        <ArticleDetail content={visit.memo} />
      </article>

      {/* 店舗情報 */}
      <ShopInformation shop={visit.shop} />
    </Container>,
    { meta }
  )
})
