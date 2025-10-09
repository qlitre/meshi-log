import { createClient, type MicroCMSQueries } from 'microcms-js-sdk'
import type { Area, Genre, Shop, Visit } from '../types/microcms'

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

export const getMicroCMSClient = ({ serviceDomain, apiKey }: ClientConfig) => {
  return createClient({
    serviceDomain,
    apiKey,
  })
}

// エリア一覧取得
export const getAreas = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Area>({
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
