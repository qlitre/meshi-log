import { createRoute } from 'honox/factory'
import type { MicroCMSQueries } from 'microcms-js-sdk'
import type { Meta } from '../types/meta'
import { VisitListCard } from '../components/VisitListCard'
import { PageHeading } from '../components/PageHeading'
import { Container } from '../components/Container'
import { getMicroCMSClient, getVisits } from '../libs/microcms'
import SearchForm from '../islands/SearchForm'

const limit = 30

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })
  const keyword = c.req.query('q') || ''
  const queries: MicroCMSQueries = {
    limit: limit,
    q: keyword,
  }
  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/`

  const visits = await getVisits({ client, queries })
  const meta: Meta = {
    title: `飯ログ - 訪問記録検索結果`,
    description: '主に行った飯屋を記録しているwebサイト',
    ogpType: 'website' as const,
    ogpUrl: canonicalUrl,
  }

  return c.render(
    <Container>
      <div class="space-y-6">
        <PageHeading>訪問記録検索</PageHeading>
        <SearchForm initialQuery={keyword} placeholder="訪問記録を検索..." />
        {keyword ? (
          <>
            {visits.totalCount === 0 ? (
              <p class="text-gray-500">「{keyword}」の検索結果が見つかりませんでした</p>
            ) : (
              <>
                <p class="text-sm text-gray-600">
                  「{keyword}」の検索結果: {visits.totalCount}件
                </p>
                <div class="space-y-6">
                  {visits.contents.map((visit) => (
                    <VisitListCard visit={visit} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p class="text-gray-500">キーワードを入力して検索してください</p>
        )}
      </div>
    </Container>,
    { meta }
  )
})
