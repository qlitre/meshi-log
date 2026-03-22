import type { Shop, Visit } from './types'

export function renderShopCard(shop: Shop): string {
  const genres = shop.genre?.map((g) => g.name).join(', ') ?? ''
  const area = shop.area?.name ?? ''
  const badge = shop.is_recommended ? '<span class="shop-badge">おすすめ</span>' : ''
  return `<div class="shop-card">
    <div><span class="shop-name">${shop.name}</span>${badge}</div>
    <div class="shop-meta">${area} / ${genres}</div>
    ${shop.memo ? `<div class="shop-memo">${shop.memo}</div>` : ''}
    <button class="visit-btn" onclick="loadVisit(this, '${shop.id}')">最新の訪問を見る</button>
    <div class="shop-detail"></div>
  </div>`
}

export function renderVisitDetail(visit: Visit): string {
  const date = visit.visit_date ? new Date(visit.visit_date).toLocaleDateString('ja-JP') : ''
  const plainMemo = visit.memo ? visit.memo.replace(/<[^>]*>/g, '') : ''
  const memo = plainMemo
    ? plainMemo.slice(0, 150) + (plainMemo.length > 150 ? '…' : '')
    : ''
  const url = `https://meshi-log.info/visits/${visit.id}`
  return `<div class="visit-card">
    <div class="visit-title">${visit.title ?? '訪問記録'}</div>
    ${date ? `<div class="visit-date">${date}</div>` : ''}
    ${memo ? `<div class="visit-memo">${memo}</div>` : ''}
    <a class="visit-link" href="#" onclick="openLink('${url}'); return false;">飯ログで詳細を見る →</a>
  </div>`
}

export function renderEmptyVisit(): string {
  return '<div class="detail-empty">訪問記録はまだありません</div>'
}
