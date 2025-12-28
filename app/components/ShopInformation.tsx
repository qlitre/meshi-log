import type { Shop } from '../types/microcms'

type Props = {
  shop: Shop
}

export const ShopInformation = ({ shop }: Props) => {
  return (
    <div class="bg-gray-50 rounded-lg p-4 max-w-[860px] mx-auto">
      <h2 class="text-xl font-bold mb-3">店舗情報</h2>
      <div class="space-y-2">
        <div>
          <p class="text-sm font-medium text-gray-700">店名</p>
          <p>{shop.name}</p>
        </div>
        {shop.nearest_station && (
          <div>
            <p class="text-sm font-medium text-gray-700">最寄駅</p>
            <p>{shop.nearest_station}</p>
          </div>
        )}
        <div>
          <p class="text-sm font-medium text-gray-700">住所</p>
          <p>{shop.address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Googleマップで開く
          </a>
          <div class="mt-2">
            <iframe
              width="100%"
              height="250"
              style="border:0; border-radius: 0.5rem;"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&output=embed`}
            ></iframe>
          </div>
        </div>
        <div class="pt-3">
          <a
            href={`/shops/${shop.id}`}
            class="inline-block px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            この店舗の他の訪問記録を見る
          </a>
        </div>
      </div>
    </div>
  )
}
