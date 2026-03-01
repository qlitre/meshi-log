import type { Shop } from '../types/microcms'
import { Badge } from './Badge'
import { getShopGenreString } from '../utils/getShopGenreString'

type Props = {
  shop: Shop
}

export const ShopListItem = ({ shop }: Props) => {
  return (
    <a
      href={`/shops/${shop.id}`}
      class="block py-3 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-start gap-3">
        <div class="flex-1 min-w-0">
          {/* ヘッダー: 店舗名 + おすすめバッジ */}
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <h2 class="text-base font-semibold">{shop.name}</h2>
            {shop.is_recommended && <Badge color="yellow">おすすめ</Badge>}
          </div>

          {/* メタ情報: エリア、ジャンル、最寄駅 */}
          <div class="flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span>{shop.area.name}</span>
            <span class="text-gray-400">•</span>
            <span>{getShopGenreString(shop.genre)}</span>
            {shop.nearest_station && (
              <>
                <span class="text-gray-400">•</span>
                <span>{shop.nearest_station}</span>
              </>
            )}
          </div>

          {/* メモ（存在する場合） */}
          {shop.memo && (
            <p class="mt-1 text-xs text-gray-600 line-clamp-1">{shop.memo}</p>
          )}
        </div>
      </div>
    </a>
  )
}
