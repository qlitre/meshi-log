import { useState, useEffect, useRef } from 'hono/jsx'

type Props = {
  author: string
  visitId: string
  siteKey: string
  error?: string
}

export default function CommentForm({ author, visitId, siteKey, error }: Props) {
  const [authorError, setAuthorError] = useState('')
  const [contentError, setContentError] = useState('')
  const turnstileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Turnstileスクリプトを動的に読み込み
    if (document.querySelector('script[src*="turnstile"]')) return
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  const handleSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement
    const author = (form.elements.namedItem('author') as HTMLInputElement).value.trim()
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value.trim()

    let hasError = false
    if (!author) {
      setAuthorError('名前を入力してください')
      hasError = true
    } else {
      setAuthorError('')
    }
    if (!content) {
      setContentError('コメントを入力してください')
      hasError = true
    } else {
      setContentError('')
    }

    if (hasError) {
      e.preventDefault()
    }
  }

  return (
    <div class="mt-8 max-w-[860px] mx-auto">
      <h2 class="text-xl font-bold mb-4">コメントを投稿</h2>
      {error && <div class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      <form method="post" onSubmit={handleSubmit} class="space-y-4">
        <input type="hidden" name="visitId" value={visitId} />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="author">
            名前
          </label>
          <input
            type="text"
            value={author}
            id="author"
            name="author"
            maxLength={50}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {authorError && <p class="mt-1 text-sm text-red-600">{authorError}</p>}
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="content">
            コメント
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            maxLength={1000}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {contentError && <p class="mt-1 text-sm text-red-600">{contentError}</p>}
        </div>
        <div ref={turnstileRef} class="cf-turnstile" data-sitekey={siteKey} data-theme="light" />
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          投稿する
        </button>
      </form>
    </div>
  )
}
