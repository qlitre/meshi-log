import type { ErrorHandler } from 'hono'
import { Container } from '../components/Container'
import { LinkToTop } from '../components/LinkToTop'

const handler: ErrorHandler = (e, c) => {
  if ('getResponse' in e) {
    return e.getResponse()
  }
  console.error(e.message)
  c.status(500)
  return c.render(
    <Container>
      <div class="flex flex-col items-center justify-center text-center py-12">
        <p class="text-8xl font-bold text-gray-200">500</p>
        <h2 class="mt-4 text-2xl font-bold text-gray-800">サーバーエラーが発生しました</h2>
        <p class="mt-3 text-gray-500 max-w-md">
          申し訳ありません。しばらく時間をおいてから再度お試しください。
        </p>
        <LinkToTop />
      </div>
    </Container>
  )
}

export default handler
