import { useState } from 'hono/jsx'

type Props = {
  initialQuery?: string
  placeholder?: string
  redirectToSearchPage?: boolean
}

export default function SearchForm({
  initialQuery = '',
  placeholder = '検索...',
  redirectToSearchPage = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (redirectToSearchPage) {
      // 検索ページに遷移
      if (query.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
      } else {
        window.location.href = '/search'
      }
    } else {
      // 現在のページで検索
      const url = new URL(window.location.href)
      if (query) {
        url.searchParams.set('q', query)
      } else {
        url.searchParams.delete('q')
      }
      url.searchParams.delete('page') // 検索時はページをリセット
      window.location.href = url.toString()
    }
  }

  const handleClear = () => {
    if (redirectToSearchPage) {
      setQuery('')
    } else {
      window.location.href = '/search'
    }
  }

  return (
    <form onSubmit={handleSubmit} class="mb-6">
      <div class="flex gap-2">
        <input
          type="text"
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder={placeholder}
          class="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          検索
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            class="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
          >
            クリア
          </button>
        )}
      </div>
    </form>
  )
}
