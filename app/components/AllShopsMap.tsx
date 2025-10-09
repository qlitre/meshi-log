// app/components/AllShopsMap.tsx
import type { Shop } from '../types/microcms'

type Props = {
  shops: Shop[]
}

export const AllShopsMap = ({ shops }: Props) => {
  // 座標を持つ店舗のみフィルタリング
  const shopsWithCoords = shops.filter(shop => shop.latitude && shop.longitude)
  
  if (shopsWithCoords.length === 0) {
    return (
      <div class="bg-gray-100 rounded-lg p-8 text-center">
        <p class="text-gray-600">座標が登録されている店舗がありません</p>
      </div>
    )
  }

  // 全店舗の中心点を計算
  const avgLat = shopsWithCoords.reduce((sum, shop) => sum + (shop.latitude || 0), 0) / shopsWithCoords.length
  const avgLng = shopsWithCoords.reduce((sum, shop) => sum + (shop.longitude || 0), 0) / shopsWithCoords.length

  // 全店舗が収まる範囲を計算
  const lats = shopsWithCoords.map(shop => shop.latitude || 0)
  const lngs = shopsWithCoords.map(shop => shop.longitude || 0)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  // bbox を少し広めに設定
  const padding = 0.01
  const bbox = `${minLng - padding},${minLat - padding},${maxLng + padding},${maxLat + padding}`

  // OpenStreetMap の embed URL を構築
  // 複数マーカーを表示するために、各店舗のマーカーをクエリパラメータに追加
  const markers = shopsWithCoords
    .map(shop => `pin-s+ff0000(${shop.longitude},${shop.latitude})`)
    .join(',')

  // Leaflet を使った独自マップ実装
  return (
    <div class="space-y-4">
      <div class="w-full rounded-lg overflow-hidden shadow-md" style="height: 600px;">
        <div id="map" class="w-full h-full" data-shops={JSON.stringify(shopsWithCoords)} />
      </div>
      
      <div class="text-right text-sm text-gray-600">
        <p>{shopsWithCoords.length} 店舗を表示中</p>
      </div>
      
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const mapEl = document.getElementById('map');
            const shops = JSON.parse(mapEl.dataset.shops);
            
            // 地図の初期化
            const map = L.map('map').setView([${avgLat}, ${avgLng}], 10);
            
            // OpenStreetMap タイルレイヤーを追加
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // 各店舗にマーカーを追加
            shops.forEach(shop => {
              const marker = L.marker([shop.latitude, shop.longitude]).addTo(map);
              marker.bindPopup(\`
                <div style="min-width: 200px;">
                  <h3 style="font-weight: bold; margin-bottom: 8px;">
                    <a href="/shops/\${shop.id}" style="color: #2563eb; text-decoration: none;">
                      \${shop.name}
                    </a>
                  </h3>
                  <p style="font-size: 12px; color: #666;">
                    \${shop.area.name} - \${shop.genre.name}
                  </p>
                  <p style="font-size: 12px; margin-top: 4px;">
                    \${shop.address}
                  </p>
                </div>
              \`);
            });
            
            // 全マーカーが収まるように調整
            if (shops.length > 0) {
              const bounds = L.latLngBounds(shops.map(shop => [shop.latitude, shop.longitude]));
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          })();
        `
      }} />
    </div>
  )
}