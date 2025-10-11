import type { Shop } from '../types/microcms'

type Props = {
  shop: Shop
}

export const ShopInformation = ({ shop }: Props) => {
  return (
    <div class="bg-gray-50 rounded-lg p-6 max-w-[860px] mx-auto">
      <h2 class="text-2xl font-bold mb-4">店舗情報</h2>
      <div class="space-y-3">
        <div>
          <p class="font-medium text-gray-700">店名</p>
        </div>
        <div>
          <p class="font-medium text-gray-700">住所</p>
          <p>{shop.address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Googleマップで開く
          </a>
          <div class="mt-4">
            <iframe
              width="100%"
              height="300"
              style="border:0; border-radius: 0.5rem;"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&output=embed`}
            ></iframe>
          </div>
        </div>
        <div class="pt-4">
          <a
            href={`/shops/${shop.id}`}
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            この店舗の他の訪問記録を見る
          </a>
        </div>
      </div>
    </div>
  )
}
