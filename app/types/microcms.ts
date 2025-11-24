// microCMS APIレスポンス型定義
import type {
  MicroCMSContentId,
  MicroCMSDate,
  MicroCMSListResponse,
  MicroCMSImage,
} from 'microcms-js-sdk'

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
  latitude: number
  longitude: number
  area: Area
  genre: Genre
  nearest_station?: string // 最寄駅 (optional)
  memo: string // textArea (required)
  is_recommended: boolean // boolean (required)
  rating?: number // number (optional)
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
