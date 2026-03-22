// mcp-app用の型定義（microcms-js-sdk非依存）

export interface Area {
  id: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export interface Shop {
  id: string
  name: string
  area?: Area
  genre?: Genre[]
  memo?: string
  is_recommended?: boolean
}

export interface Visit {
  id: string
  title?: string
  visit_date?: string
  memo?: string
}

export interface ShopListResponse {
  totalCount: number
  contents: Shop[]
}

export interface AreaListResponse {
  contents: Area[]
}

export interface GenreListResponse {
  contents: Genre[]
}
