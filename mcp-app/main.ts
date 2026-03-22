/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { App } from '@modelcontextprotocol/ext-apps'
import type { Visit, ShopListResponse, AreaListResponse, GenreListResponse } from './types'

const searchInput = document.getElementById('search-input') as HTMLInputElement
const areaSelect = document.querySelector<HTMLSelectElement>('#area-select')!
const genreSelect = document.querySelector<HTMLSelectElement>('#genre-select')!

const recommendedCheck = document.getElementById('recommended-check') as HTMLInputElement
const searchBtn = document.getElementById('search-btn')!
const resultsEl = document.getElementById('results')!
const countEl = document.getElementById('count')!

const app = new App({ name: 'Shop Search APP', version: '1.0.0' })

// 初回ツール結果
app.ontoolresult = (result) => {
  const text = result.content?.find((c) => c.type === 'text')?.text
  if (text) renderShops(JSON.parse(text))
}

// 検索ボタン
searchBtn.addEventListener('click', async () => {
  const q = searchInput.value.trim()
  const area_id = areaSelect.value
  const genre_id = genreSelect.value
  const is_recommended = recommendedCheck.checked
  resultsEl.textContent = '検索中…'
  const result = await app.callServerTool({
    name: 'search_shops',
    arguments: {
      ...(q && { q }),
      ...(area_id && { area_id }),
      ...(genre_id && { genre_id }),
      ...(is_recommended && { is_recommended }),
    },
  })
  const text = result.content?.find((c) => c.type === 'text')?.text
  if (text) renderShops(JSON.parse(text))
})

// 最新訪問を取得・表示
async function loadVisit(btn: HTMLElement, shopId: string) {
  const card = btn.closest('.shop-card') as HTMLElement
  const detail = card.querySelector('.shop-detail') as HTMLElement

  if (detail.classList.contains('open')) {
    detail.classList.remove('open')
    return
  }
  if (detail.dataset.loaded) {
    detail.classList.add('open')
    return
  }

  btn.textContent = '読み込み中…'
  btn.classList.add('loading')

  const result = await app.callServerTool({
    name: 'get_recent_visit_detail_by_shop',
    arguments: { shop_id: shopId },
  })
  const text = result.content?.find((c) => c.type === 'text')?.text
  const visit: Visit | null = text ? JSON.parse(text) : null

  if (visit && visit.id) {
    const date = visit.visit_date ? new Date(visit.visit_date).toLocaleDateString('ja-JP') : ''
    const memo = visit.memo
      ? visit.memo.replace(/<[^>]*>/g, '').slice(0, 150) +
        (visit.memo.replace(/<[^>]*>/g, '').length > 150 ? '…' : '')
      : ''
    const url = `https://meshi-log.info/visits/${visit.id}`
    detail.innerHTML = `
      <div class="visit-card">
        <div class="visit-title">${visit.title ?? '訪問記録'}</div>
        ${date ? `<div class="visit-date">${date}</div>` : ''}
        ${memo ? `<div class="visit-memo">${memo}</div>` : ''}
        <a class="visit-link" href="#" onclick="openLink('${url}'); return false;">飯ログで詳細を見る →</a>
      </div>`
  } else {
    detail.innerHTML = '<div class="detail-empty">訪問記録はまだありません</div>'
  }

  detail.dataset.loaded = '1'
  detail.classList.add('open')
  btn.textContent = '最新の訪問を見る'
  btn.classList.remove('loading')
}

async function openLink(url: string) {
  await app.openLink({ url })
}

;(window as any).loadVisit = loadVisit
;(window as any).openLink = openLink

// 結果描画
function renderShops(data: ShopListResponse) {
  countEl.textContent = `${data.totalCount}件`
  resultsEl.innerHTML = data.contents
    .map((shop) => {
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
    })
    .join('')
}

// ホストに接続後、エリア・ジャンルを取得
async function init() {
  await app.connect()

  const [areas, genres] = await Promise.all([
    app.callServerTool({ name: 'get_areas', arguments: {} }),
    app.callServerTool({ name: 'get_genres', arguments: {} }),
  ])

  const areasData: AreaListResponse = JSON.parse(
    areas.content?.find((c) => c.type === 'text')?.text ?? '{"contents":[]}'
  )
  for (const area of areasData.contents ?? []) {
    const opt = document.createElement('option')
    opt.value = area.id
    opt.textContent = area.name
    areaSelect.appendChild(opt)
  }

  const genresData: GenreListResponse = JSON.parse(
    genres.content?.find((c) => c.type === 'text')?.text ?? '{"contents":[]}'
  )
  for (const genre of genresData.contents ?? []) {
    const opt = document.createElement('option')
    opt.value = genre.id
    opt.textContent = genre.name
    genreSelect.appendChild(opt)
  }
}

init()
