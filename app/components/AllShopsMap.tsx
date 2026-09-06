import type { Shop } from '../types/microcms'
import { raw } from 'hono/html'
import { getShopGenreString } from '../utils/getShopGenreString'

type Props = {
  shops: Shop[]
}

export const AllShopsMap = ({ shops }: Props) => {
  // 座標を持つ店舗のみフィルタリング + ジャンル文字列を事前に生成
  const shopsWithCoords = shops
    .filter((shop) => shop.latitude && shop.longitude)
    .map((shop) => ({
      ...shop,
      genreString: getShopGenreString(shop.genre),
    }))

  if (shopsWithCoords.length === 0) {
    return (
      <div class="bg-gray-100 rounded-lg p-8 text-center">
        <p class="text-gray-600">座標が登録されている店舗がありません</p>
      </div>
    )
  }

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
      <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
      />
      <script>
        {raw(`
          (function() {
            const mapEl = document.getElementById('map');
            const shops = JSON.parse(mapEl.dataset.shops);
            
            // 地図の初期化（全マーカーが収まる範囲に合わせる）
            const bounds = L.latLngBounds(shops.map(shop => [shop.latitude, shop.longitude]));
            const map = L.map('map').fitBounds(bounds, { padding: [50, 50] });
            
            // OpenStreetMap タイルレイヤーを追加
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // おすすめ店舗用のカスタムアイコン
            const defaultIcon = L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            const recommendedIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
              iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            // 近接マーカーをまとめるクラスタグループ
            // 実際に重なる距離だけまとめ、最大ズームでも重なる場合はクリックで放射状に展開する
            const clusterGroup = L.markerClusterGroup({
              maxClusterRadius: 45,
              spiderfyOnMaxZoom: true,
              showCoverageOnHover: false
            });

            // 各店舗にマーカーを追加
            shops.forEach(shop => {
              const icon = shop.is_recommended ? recommendedIcon : defaultIcon;
              const marker = L.marker([shop.latitude, shop.longitude], { icon });
              marker.bindPopup(\`
                <div style="min-width: 200px;">
                  <h3 style="font-weight: bold; margin-bottom: 8px;">
                    <a href="/shops/\${shop.id}" style="color: #2563eb; text-decoration: none;">
                      \${shop.is_recommended ? '⭐ ' : ''}\${shop.name}
                    </a>
                  </h3>
                  <p style="font-size: 12px; color: #666;">
                    \${shop.area.name} - \${shop.genreString}
                  </p>
                  <p style="font-size: 12px; margin-top: 4px;">
                    \${shop.address}
                  </p>
                </div>
              \`);
              clusterGroup.addLayer(marker);
            });

            map.addLayer(clusterGroup);
          })();
        `)}
      </script>
    </div>
  )
}
