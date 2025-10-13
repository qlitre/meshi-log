import { useState } from 'hono/jsx'
import type { Area, Genre } from '../types/microcms'

type ShopFilterFormProps = {
  areas: Area[]
  genres: Genre[]
  initialFilters: {
    q?: string
    area?: string
    genre?: string
    isRecommended?: boolean
  }
}

export default function ShopFilterForm({ areas, genres, initialFilters }: ShopFilterFormProps) {
  const [query, setQuery] = useState(initialFilters.q || '')
  const [areaId, setAreaId] = useState(initialFilters.area || '')
  const [genreId, setGenreId] = useState(initialFilters.genre || '')
  const [isRecommended, setIsRecommended] = useState(initialFilters.isRecommended || false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const url = new URL(window.location.href)

    // クエリパラメータをクリア
    url.searchParams.delete('q')
    url.searchParams.delete('area')
    url.searchParams.delete('genre')
    url.searchParams.delete('recommended')
    url.searchParams.delete('page')

    // 新しいフィルタを設定
    if (query) url.searchParams.set('q', query)
    if (areaId) url.searchParams.set('area', areaId)
    if (genreId) url.searchParams.set('genre', genreId)
    if (isRecommended) url.searchParams.set('recommended', '1')

    window.location.href = url.toString()
  }

  const handleClear = () => {
    setQuery('')
    setAreaId('')
    setGenreId('')
    setIsRecommended(false)
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    url.searchParams.delete('area')
    url.searchParams.delete('genre')
    url.searchParams.delete('recommended')
    url.searchParams.delete('page')
    window.location.href = url.toString()
  }

  const hasFilters = query || areaId || genreId || isRecommended

  return (
    <div class="mb-6">
      {/* トグルボタン（スマホのみ表示） */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="md:hidden w-full mb-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-between"
      >
        <span>検索条件{hasFilters && '（設定中）'}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* フォーム本体 */}
      <form
        onSubmit={handleSubmit}
        class={`p-4 bg-gray-50 rounded-lg ${isOpen ? 'block' : 'hidden md:block'}`}
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* キーワード検索 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">キーワード</label>
          <input
            type="text"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            placeholder="店名で検索..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* エリア選択 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">エリア</label>
          <select
            value={areaId}
            onChange={(e) => setAreaId((e.target as HTMLSelectElement).value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* ジャンル選択 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ジャンル</label>
          <select
            value={genreId}
            onChange={(e) => setGenreId((e.target as HTMLSelectElement).value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* おすすめフラグ */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">その他</label>
          <label class="flex items-center h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={isRecommended}
              onChange={(e) => setIsRecommended((e.target as HTMLInputElement).checked)}
              class="mr-2"
            />
            <span class="text-sm">おすすめのみ</span>
          </label>
        </div>
      </div>

      {/* ボタン */}
      <div class="flex gap-2">
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          検索
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            クリア
          </button>
        )}
      </div>
      </form>
    </div>
  )
}
