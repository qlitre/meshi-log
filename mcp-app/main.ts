/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { App } from '@modelcontextprotocol/ext-apps'

const searchInput = document.getElementById('search-input') as HTMLInputElement
const areaSelect = document.querySelector<HTMLSelectElement>('#area-select')!
const genreSelect = document.querySelector<HTMLSelectElement>('#genre-select')!

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
  resultsEl.textContent = '検索中…'
  const result = await app.callServerTool({
    name: 'search_shops',
    arguments: {
      ...(q && { q }),
      ...(area_id && { area_id }),
      ...(genre_id && { genre_id }),
    },
  })
  const text = result.content?.find((c) => c.type === 'text')?.text
  if (text) renderShops(JSON.parse(text))
})

// 結果描画
function renderShops(data: { totalCount: number; contents: any[] }) {
  countEl.textContent = `${data.totalCount}件`
  resultsEl.innerHTML = data.contents
    .map((shop) => {
      const genres = shop.genre?.map((g: any) => g.name).join(', ') ?? ''
      const area = shop.area?.name ?? ''
      const badge = shop.is_recommended ? ' ⭐おすすめ' : ''
      return `<div style="padding:8px;border-bottom:1px solid #eee">
        <strong>${shop.name}</strong>${badge}<br/>
        <small>${area} / ${genres}</small><br/>
        <span>${shop.memo ?? ''}</span>
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

  const areasData = JSON.parse(areas.content?.find((c) => c.type === 'text')?.text ?? '{}')
  for (const area of areasData.contents ?? []) {
    const opt = document.createElement('option')
    opt.value = area.id
    opt.textContent = area.name
    areaSelect.appendChild(opt)
  }

  const genresData = JSON.parse(genres.content?.find((c) => c.type === 'text')?.text ?? '{}')
  for (const genre of genresData.contents ?? []) {
    const opt = document.createElement('option')
    opt.value = genre.id
    opt.textContent = genre.name
    genreSelect.appendChild(opt)
  }
}

init()
