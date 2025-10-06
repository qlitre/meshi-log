import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisits } from '../libs/microcms'
import { Container } from '../components/Container'
import { VisitListCard } from '../components/VisitListCard'
import type { Meta } from '../types/meta'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/`

  const meta: Meta = {
    title: `飯ログ - 訪問記録`,
    description: '主に行った飯屋を記録しているwebサイト',
    keywords: '旨い店',
    canonicalUrl: canonicalUrl,
    ogpType: 'article' as const,
    ogpUrl: canonicalUrl,
  }

  const { contents: visits, totalCount } = await getVisits({ client, queries: { depth: 2 } })

  return c.render(
    <Container>
      {/* 訪問記録一覧 */}
      <div class="space-y-6">
        <h2 class="text-xl font-bold">訪問記録 ({totalCount}件)</h2>

        {totalCount === 0 ? (
          <p class="text-gray-500">まだ訪問記録がありません</p>
        ) : (
          <div class="space-y-6">
            {visits.map((visit) => (
              <VisitListCard visit={visit} />
            ))}
          </div>
        )}
      </div>
    </Container>,
    { meta }
  )
})
