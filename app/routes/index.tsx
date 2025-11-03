import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisits } from '../libs/microcms'
import { Container } from '../components/Container'
import { VisitListCard } from '../components/VisitListCard'
import { Pagination } from '../components/Pagination'
import { PageHeading } from '../components/PageHeading'
import type { Meta } from '../types/meta'
import { config } from '../siteSettings'
import { SearchForm } from '../islands/SearchForm'

export default createRoute(async (c) => {
  const client = getMicroCMSClient(c)

  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/`

  const meta: Meta = {
    title: `飯ログ - 訪問記録`,
    description: '主に行った飯屋を記録しているwebサイト',
    keywords: '旨い店',
    canonicalUrl: canonicalUrl,
    ogpType: 'website' as const,
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
        <PageHeading>訪問記録</PageHeading>
        <SearchForm redirectToSearchPage={true} placeholder="訪問記録を検索..." />
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

      <Pagination
        totalCount={totalCount}
        limit={config.perPage}
        currentPage={page}
        basePath="/"
        query={queryParams}
      />
    </Container>,
    { meta }
  )
})
