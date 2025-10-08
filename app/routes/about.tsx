import { createRoute } from 'honox/factory'
import { Container } from '../components/Container'
import type { Meta } from '../types/meta'
import { LinkToTop } from '../components/LinkToTop'

export default createRoute(async (c) => {
  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/about`

  const meta: Meta = {
    title: `飯ログについて`,
    description: '飯ログの概要',
    keywords: '飯ログ,訪問記録,飲食店',
    canonicalUrl: canonicalUrl,
    ogpType: 'website' as const,
    ogpUrl: canonicalUrl,
  }

  return c.render(
    <Container>
      <div class="space-y-8">
        <div>
          <h2 class="text-xl font-bold mb-4">飯ログについて</h2>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-700 leading-relaxed mb-4">
              このサイトは主に自分が行った飯屋を記録する目的で始めた。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              自分の行動範囲から神奈川、東京都内の店が中心となると思う。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              Xでも有益な情報をつぶやいているので気になったらぜひフォローをしてほしい。
              <br />
              <a
                href="https://x.com/kuri_tter"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 underline"
              >
                @kuri_tter
              </a>
            </p>
          </div>
        </div>
        <LinkToTop />
      </div>
    </Container>,
    { meta }
  )
})
