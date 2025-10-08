import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisits } from '../libs/microcms'
import { Container } from '../components/Container'
import { VisitListCard } from '../components/VisitListCard'
import { Pagination } from '../components/Pagination'
import type { Meta } from '../types/meta'
import { config } from '../siteSettings'

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
  const page = Number(c.req.query('page') || 1)
  const limit = config.perPage
  const offset = limit * (page - 1)

  const visitsResponse = await getVisits({
    client,
    queries: { limit: limit, offset: offset, depth: 2 },
  })
  const totalCount = visitsResponse.totalCount
  const visits = visitsResponse.contents

  const queryParams: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    if (key !== 'page') {
      queryParams[key] = value
    }
  })

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

      <Pagination totalCount={totalCount} currentPage={page} basePath="/" query={queryParams} />
    </Container>,
    { meta }
  )
})
