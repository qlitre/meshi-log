// microCMS APIレスポンス型定義
import type { MicroCMSContentId, MicroCMSDate, MicroCMSListResponse, MicroCMSImage } from 'microcms-js-sdk'

// エリア
export interface Area extends MicroCMSContentId, MicroCMSDate {
  name: string
}

// ジャンル
export interface Genre extends MicroCMSContentId, MicroCMSDate {
  name: string
}

// お店
export interface Shop extends MicroCMSContentId, MicroCMSDate {
  name: string
  address: string
  area: Area
  genre: Genre
  memo: string
  rating?: number
}

// 訪問記録
export interface Visit extends MicroCMSContentId, MicroCMSDate {
  title: string
  thumbnail?: MicroCMSImage
  shop: Shop
  visit_date: string
  memo: string // richEditorV2
}

// リスト形式APIのレスポンス型をエクスポート
export type { MicroCMSListResponse }
