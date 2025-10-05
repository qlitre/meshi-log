import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisits } from '../libs/microcms'
import { Container } from '../components/Container'
import { VisitListCard } from '../components/VisitListCard'

export default createRoute(async (c) => {
  const client = getMicroCMSClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })

  const { contents: visits, totalCount } = await getVisits({ client, queries: { depth: 2 } })

  return c.render(
    <Container>
      <title>飯ログ - 訪問記録</title>

      {/* 訪問記録一覧 */}
      <div class="space-y-6">
        <h2 class="text-2xl font-bold">訪問記録 ({totalCount}件)</h2>

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
    </Container>
  )
})
