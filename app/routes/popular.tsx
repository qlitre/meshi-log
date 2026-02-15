import { createRoute } from 'honox/factory'
import { getPopularPages } from '../libs/pageview'
import { Container } from '../components/Container'
import { PopularArticleCard } from '../components/PopularArticleCard'
import { PageHeading } from '../components/PageHeading'
import { LinkToTop } from '../components/LinkToTop'
import type { Meta } from '../types/meta'

export default createRoute(async (c) => {
  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/popular`

  const meta: Meta = {
    title: '人気記事 - 飯ログ',
    description: 'よく読まれている訪問記録のランキング',
    keywords: '人気記事,ランキング',
    canonicalUrl: canonicalUrl,
    ogpType: 'website' as const,
    ogpUrl: canonicalUrl,
  }

  const popularPages = await getPopularPages(c.env.DB, 20)

  return c.render(
    <Container>
      <div class="space-y-6">
        <PageHeading>人気記事</PageHeading>
        {popularPages.length === 0 ? (
          <p class="text-gray-500">まだデータがありません</p>
        ) : (
          <div class="space-y-6">
            {popularPages.map((article, index) => (
              <PopularArticleCard article={article} rank={index + 1} />
            ))}
          </div>
        )}
      </div>
      <LinkToTop />
    </Container>,
    { meta }
  )
})
