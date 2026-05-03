import { createClient, type MicroCMSQueries } from 'microcms-js-sdk'
import type { Area, Genre, Shop, Visit } from '../types/microcms'
import type { Context } from 'hono'

type MicroCMSClient = ReturnType<typeof createClient>

type ClientConfig = {
  serviceDomain: string
  apiKey: string
}

type ClientWithQueries = {
  client: MicroCMSClient
  queries?: MicroCMSQueries
}

type ClientWithContentId = {
  client: MicroCMSClient
  contentId: string
  queries?: MicroCMSQueries
}

type ClientWithPublishedAt = {
  client: MicroCMSClient
  publishedAt: string
}

export const getMicroCMSClient = (c: Context) => {
  return createClient({
    serviceDomain: c.env.SERVICE_DOMAIN,
    apiKey: c.env.API_KEY,
  })
}

// エリア一覧取得
export const getAreas = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Area>({
    endpoint: 'area',
    queries,
  })
}

// 全エリア取得
export const getAllAreas = async ({ client, queries }: ClientWithQueries) => {
  return await client.getAllContents<Area>({
    endpoint: 'area',
    queries,
  })
}

// ジャンル一覧取得
export const getGenres = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Genre>({
    endpoint: 'genre',
    queries,
  })
}

// 全ジャンル取得
export const getAllGenres = async ({ client, queries }: ClientWithQueries) => {
  return await client.getAllContents<Genre>({
    endpoint: 'genre',
    queries,
  })
}

// 店舗一覧取得
export const getShops = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Shop>({
    endpoint: 'shop',
    queries,
  })
}

// 全店舗取得
export const getAllShops = async ({ client, queries }: ClientWithQueries) => {
  return await client.getAllContents<Shop>({
    endpoint: 'shop',
    queries,
  })
}

// 店舗詳細取得
export const getShopDetail = async ({ client, contentId, queries }: ClientWithContentId) => {
  return await client.getListDetail<Shop>({
    endpoint: 'shop',
    contentId,
    queries,
  })
}

// 訪問記録一覧取得
export const getVisits = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Visit>({
    endpoint: 'visits',
    queries,
  })
}

// 全訪問記録取得
export const getAllVisits = async ({ client, queries }: ClientWithQueries) => {
  return await client.getAllContents<Visit>({
    endpoint: 'visits',
    queries,
  })
}

// 訪問記録詳細取得
export const getVisitDetail = async ({ client, contentId, queries }: ClientWithContentId) => {
  return await client.getListDetail<Visit>({
    endpoint: 'visits',
    contentId,
    queries,
  })
}

export const getPrevVisits = async ({ client, publishedAt }: ClientWithPublishedAt) => {
  return await client.getList<Visit>({
    endpoint: 'visits',
    queries: { limit: 1, filters: `publishedAt[less_than]${publishedAt}`, orders: '-publishedAt' },
  })
}

export const getNextVisits = async ({ client, publishedAt }: ClientWithPublishedAt) => {
  return await client.getList<Visit>({
    endpoint: 'visits',
    queries: {
      limit: 1,
      filters: `publishedAt[greater_than]${publishedAt}`,
      orders: 'publishedAt',
    },
  })
}

// エリア新規作成
export const createArea = async ({
  client,
  contentId,
  body,
}: {
  client: MicroCMSClient
  contentId?: string
  body: { code: string; name: string }
}) => {
  return await client.create({ endpoint: 'area', contentId, content: body })
}

// ジャンル新規作成
export const createGenre = async ({
  client,
  contentId,
  body,
}: {
  client: MicroCMSClient
  contentId?: string
  body: { name: string }
}) => {
  return await client.create({endpoint: 'genre', contentId, content: body })
}

// 店舗新規作成
export type CreateShopBody = {
  name: string
  address: string
  latitude: number
  longitude: number
  area: string
  area_code: string
  genre: string[]
  memo: string
  is_recommended: boolean
  rating?: number
  nearest_station?: string
}

export const createShop = async ({
  client,
  contentId,
  body,
}: {
  client: MicroCMSClient
  contentId?: string
  body: CreateShopBody
}) => {
  return await client.create({ endpoint: 'shop', contentId, content: body })
}

export const getMicroCMSSchema = async ({ serviceDomain, apiKey }: ClientConfig) => {
  const ret = []
  const endPoints = ['genre', 'area', 'shop', 'visits']
  for (const endPoint of endPoints) {
    const response = await fetch(
      `https://${serviceDomain}.microcms-management.io/api/v1/apis/${endPoint}`,
      {
        headers: {
          'X-MICROCMS-API-KEY': apiKey,
        },
      }
    )
    const schema = await response.json()
    ret.push({ endpoint: endPoint, schema })
  }
  return ret
}
