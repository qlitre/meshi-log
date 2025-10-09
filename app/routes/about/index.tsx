import { createRoute } from 'honox/factory'
import { Container } from '../../components/Container'
import type { Meta } from '../../types/meta'
import { LinkToTop } from '../../components/LinkToTop'

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
              このサイトは主に自分の行った飯屋、飲み屋の記録をするために作成しました。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              自分の行動範囲から、神奈川、東京エリアが中心となるかと思います。
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-4">Feedについて</h2>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-700 leading-relaxed mb-4">
              この飯ログはFeed配信を行っています。お手持ちのRSSリーダーで以下のURLを登録いただけると、最新のお店訪問記事が受け取れます。
            </p>
            <p class="text-gray-700 leading-relaxed">
              <a
                href="https://meshi-log.info/feed.atom"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 underline"
              >
                https://meshi-log.info/feed.atom
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-4">MCPについて</h2>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-700 leading-relaxed mb-4">
              この飯ログはリモートMCPサーバーにツールを登録しています。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              お手元のMCPクライアントツールから以下のURLに接続いただけると、AIライクに飯ログを楽しむことができます。
            </p>
            <p class="text-gray-700 leading-relaxed">
              <a
                href="https://meshi-log.info/mcp"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 underline"
              >
                https://meshi-log.info/mcp
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-4">管理人について</h2>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-700 leading-relaxed mb-4">
              神奈川在住、都内の株式会社に勤務しています。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              趣味は音楽を聴くことです。
              インディーズからメジャーアーティストまでライブをよく見ます。下北沢によくいきます。一番好きなアーティストは柴田聡子さんです。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              週末によくプログラムを書いています。PythonやHonoなどのフレームワークが好きです。このサイトも自作をしました。
            </p>
            <p class="text-gray-700 leading-relaxed">
              <a
                href="https://x.com/kuri_tter"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 underline"
              >
                @kuri_tter
              </a>
              というアカウントでXでよくつぶやいています。
              もし興味をいただけたらフォローをしてください。
            </p>
          </div>
        </div>
        <LinkToTop />
      </div>
    </Container>,
    { meta }
  )
})
