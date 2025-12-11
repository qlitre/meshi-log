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

export const ShopFilterForm = ({ areas, genres, initialFilters }: ShopFilterFormProps) => {
  const hasFilters =
    initialFilters.q || initialFilters.area || initialFilters.genre || initialFilters.isRecommended

  return (
    <div class="mb-6">
      {/* トグル部分（モバイルのみ表示） - <details>タグで実装 */}
      <details class="md:hidden mb-2" open={!!hasFilters}>
        <summary class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer list-none flex items-center justify-between">
          <span>検索条件{hasFilters && '（設定中）'}</span>
          <span class="details-marker">▼</span>
        </summary>

        {/* フォーム本体（モバイル時） */}
        <div class="mt-2">
          <FormContent areas={areas} genres={genres} initialFilters={initialFilters} />
        </div>
      </details>

      {/* フォーム本体（デスクトップ時は常に表示） */}
      <div class="hidden md:block">
        <FormContent areas={areas} genres={genres} initialFilters={initialFilters} />
      </div>
    </div>
  )
}

// フォーム内容を共通化
const FormContent = ({ areas, genres, initialFilters }: ShopFilterFormProps) => {
  const hasFilters =
    initialFilters.q || initialFilters.area || initialFilters.genre || initialFilters.isRecommended

  return (
    <form method="get" action="/shops" class="p-4 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* キーワード検索 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">キーワード</label>
          <input
            type="text"
            name="q"
            value={initialFilters.q || ''}
            placeholder="店名で検索..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* エリア選択 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">エリア</label>
          <select
            name="area"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id} selected={area.id === initialFilters.area}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* ジャンル選択 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ジャンル</label>
          <select
            name="genre"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id} selected={genre.id === initialFilters.genre}>
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
              name="recommended"
              value="1"
              checked={initialFilters.isRecommended}
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
          <a
            href="/shops"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            クリア
          </a>
        )}
      </div>
    </form>
  )
}
