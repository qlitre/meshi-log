import type { NotFoundHandler } from 'hono'
import { Container } from '../components/Container'
import { LinkToTop } from '../components/LinkToTop'

const handler: NotFoundHandler = (c) => {
  c.status(404)
  return c.render(
    <Container>
      <div class="flex flex-col items-center justify-center text-center py-12">
        <p class="text-8xl font-bold text-gray-200">404</p>
        <h2 class="mt-4 text-2xl font-bold text-gray-800">
          ページが見つかりません
        </h2>
        <p class="mt-3 text-gray-500 max-w-md">
          お探しのページは移動または削除された可能性があります。
        </p>
        <LinkToTop />
      </div>
    </Container>
  )
}

export default handler
