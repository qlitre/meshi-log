type Props = {
  initialQuery?: string
}

export const SearchForm = ({ initialQuery = '' }: Props) => {
  const hasQuery = initialQuery.length > 0
  return (
    <form method="get" action="/search" class="mb-6">
      <div class="flex gap-2">
        <input
          type="text"
          name="q"
          value={initialQuery || ''}
          placeholder="訪問記録を検索..."
          class="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          検索
        </button>
        {hasQuery && (
          <a
            href="/search"
            class="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
          >
            クリア
          </a>
        )}
      </div>
    </form>
  )
}
