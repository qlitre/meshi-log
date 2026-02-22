import type { Shop } from '../types/microcms'
import { Badge } from './Badge'
import { getShopGenreString } from '../utils/getShopGenreString'

type Props = {
  shop: Shop
}

export const ShopListCard = ({ shop }: Props) => {
  return (
    <a
      href={`/shops/${shop.id}`}
      class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div class="flex items-center gap-2 mb-2 flex-wrap">
        <h2 class="text-xl font-semibold">{shop.name}</h2>
        {shop.is_recommended && <Badge color="yellow">おすすめ</Badge>}
      </div>

      <div class="space-y-2 text-sm text-gray-600">
        <p>
          <span class="font-medium">ジャンル: </span>
          {getShopGenreString(shop._genre)}
        </p>
        <p>
          <span class="font-medium">エリア: </span>
          {shop.area.name}
        </p>
        {shop.nearest_station && (
          <p>
            <span class="font-medium">最寄駅: </span>
            {shop.nearest_station}
          </p>
        )}
        {shop.memo && <p class="mt-3 text-gray-700 line-clamp-2">{shop.memo}</p>}
      </div>
    </a>
  )
}
