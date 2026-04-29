import { useState } from 'hono/jsx'

type AreaWithCount = {
  id: string
  name: string
  code: string
  count: number
}

type GenreWithCount = {
  id: string
  name: string
  count: number
}

type PrefectureWithCount = {
  code: string
  name: string
  count: number
}

type ShopFilterFormProps = {
  areas: AreaWithCount[]
  genres: GenreWithCount[]
  prefectures: PrefectureWithCount[]
  initialFilters: {
    q?: string
    area?: string
    pref?: string
    genre?: string[]
    isRecommended?: boolean
  }
}

type ChipProps = {
  name: string
  value: string
  checked: boolean
  label: string
  count?: number
  onClick?: (e: Event) => void
}

const LoadingOverlay = () => (
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    aria-label="読み込み中"
  >
    <div class="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
  </div>
)

const ChipRadio = ({ name, value, checked, label, count, onClick }: ChipProps) => (
  <label class="cursor-pointer">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      class="peer sr-only"
      onClick={onClick}
    />
    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-full bg-white text-gray-700 hover:border-gray-500 transition-colors peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600">
      {label}
      {count !== undefined && <span class="text-xs opacity-60">{count}</span>}
    </span>
  </label>
)

const ChipCheckbox = ({ name, value, checked, label, count, onClick }: ChipProps) => (
  <label class="cursor-pointer">
    <input
      type="checkbox"
      name={name}
      value={value}
      checked={checked}
      class="peer sr-only"
      onClick={onClick}
    />
    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-full bg-white text-gray-700 hover:border-gray-500 transition-colors peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600">
      {label}
      {count !== undefined && <span class="text-xs opacity-60">{count}</span>}
    </span>
  </label>
)

const FormContent = ({ areas, genres, prefectures, initialFilters }: ShopFilterFormProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const submitClosestForm = (e: Event) => {
    setIsLoading(true)
    ;(e.target as HTMLElement).closest('form')?.submit()
  }

  const clearGenresAndSubmit = (e: Event) => {
    const form = (e.target as HTMLElement).closest('form')
    if (!form) return
    setIsLoading(true)
    form
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"][name="genre"]')
      .forEach((el) => {
        el.checked = false
      })
    form.submit()
  }

  // 都道府県を切り替えた際は area 選択をクリアして submit
  const switchPrefAndSubmit = (e: Event) => {
    const form = (e.target as HTMLElement).closest('form')
    if (!form) return
    setIsLoading(true)
    form.querySelectorAll<HTMLInputElement>('input[type="radio"][name="area"]').forEach((el) => {
      el.checked = el.value === ''
    })
    form.submit()
  }

  // 表示用の pref（URL の pref が空でも area から派生して取る）
  const displayedPref =
    initialFilters.pref ||
    areas.find((a) => a.id === initialFilters.area)?.code?.slice(0, 2) ||
    ''

  const filteredAreas = displayedPref
    ? areas.filter((a) => a.code?.startsWith(displayedPref) ?? false)
    : []

  const hasFilters =
    initialFilters.q ||
    initialFilters.area ||
    initialFilters.pref ||
    (initialFilters.genre && initialFilters.genre.length > 0) ||
    initialFilters.isRecommended

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <form method="get" action="/shops">
        <div class="space-y-4 mb-4">
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">都道府県</label>
            <div class="flex flex-wrap gap-2">
              <ChipRadio
                name="pref"
                value=""
                checked={!displayedPref}
                label="すべて"
                onClick={switchPrefAndSubmit}
              />
              {prefectures.map((p) => (
                <ChipRadio
                  key={p.code}
                  name="pref"
                  value={p.code}
                  checked={p.code === displayedPref}
                  label={p.name}
                  count={p.count}
                  onClick={switchPrefAndSubmit}
                />
              ))}
            </div>
          </div>

          {displayedPref && (
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">エリア</label>
              <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                <ChipRadio
                  name="area"
                  value=""
                  checked={!initialFilters.area}
                  label="すべて"
                  onClick={submitClosestForm}
                />
                {filteredAreas.map((area) => (
                  <ChipRadio
                    key={area.id}
                    name="area"
                    value={area.id}
                    checked={area.id === initialFilters.area}
                    label={area.name}
                    count={area.count}
                    onClick={submitClosestForm}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ジャンル</label>
            <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              <ChipRadio
                name="genre"
                value=""
                checked={!initialFilters.genre || initialFilters.genre.length === 0}
                label="すべて"
                onClick={clearGenresAndSubmit}
              />
              {genres.map((genre) => (
                <ChipCheckbox
                  key={genre.id}
                  name="genre"
                  value={genre.id}
                  checked={initialFilters.genre?.includes(genre.id) || false}
                  label={genre.name}
                  count={genre.count}
                  onClick={submitClosestForm}
                />
              ))}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">その他</label>
            <label class="flex items-center h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer">
              <input
                type="checkbox"
                name="recommended"
                value="1"
                checked={initialFilters.isRecommended}
                class="mr-2"
                onChange={submitClosestForm}
              />
              <span class="text-sm">おすすめのみ</span>
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <button
            type="submit"
            class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            検索
          </button>
          {hasFilters && (
            <a
              href="/shops"
              class="w-full text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              クリア
            </a>
          )}
        </div>
      </form>
    </>
  )
}

export default function ShopFilterForm({
  areas,
  genres,
  prefectures,
  initialFilters,
}: ShopFilterFormProps) {
  let hasGenreFilter = false
  if (initialFilters.genre && initialFilters.genre.length > 0) hasGenreFilter = true
  const hasFilters =
    initialFilters.q ||
    initialFilters.area ||
    initialFilters.pref ||
    hasGenreFilter ||
    initialFilters.isRecommended

  return (
    <div class="mb-6">
      <details class="md:hidden mb-2" open={!!hasFilters}>
        <summary class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer list-none flex items-center justify-between">
          <span>検索条件{hasFilters && '（設定中）'}</span>
          <span class="details-marker">▼</span>
        </summary>
        <div class="mt-2">
          <FormContent
            areas={areas}
            genres={genres}
            prefectures={prefectures}
            initialFilters={initialFilters}
          />
        </div>
      </details>

      <div class="hidden md:block">
        <FormContent
          areas={areas}
          genres={genres}
          prefectures={prefectures}
          initialFilters={initialFilters}
        />
      </div>
    </div>
  )
}
