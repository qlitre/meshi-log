import { createClient, type MicroCMSQueries } from "microcms-js-sdk";
import type { Area, Genre, Shop, Visit } from "../types/microcms";

type MicroCMSClient = ReturnType<typeof createClient>;

type ClientConfig = {
  serviceDomain: string;
  apiKey: string;
};

type ClientWithQueries = {
  client: MicroCMSClient;
  queries?: MicroCMSQueries;
};

type ClientWithContentId = {
  client: MicroCMSClient;
  contentId: string;
  queries?: MicroCMSQueries;
};

export const getMicroCMSClient = ({ serviceDomain, apiKey }: ClientConfig) => {
  return createClient({
    serviceDomain,
    apiKey,
  });
};

// エリア一覧取得
export const getAreas = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Area>({
    endpoint: "area",
    queries,
  });
};

// ジャンル一覧取得
export const getGenres = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Genre>({
    endpoint: "genre",
    queries,
  });
};

// 店舗一覧取得
export const getShops = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Shop>({
    endpoint: "shop",
    queries,
  });
};

// 店舗詳細取得
export const getShopDetail = async ({
  client,
  contentId,
  queries,
}: ClientWithContentId) => {
  return await client.getListDetail<Shop>({
    endpoint: "shop",
    contentId,
    queries,
  });
};

// 訪問記録一覧取得
export const getVisits = async ({ client, queries }: ClientWithQueries) => {
  return await client.getList<Visit>({
    endpoint: "visits",
    queries,
  });
};

// 訪問記録詳細取得
export const getVisitDetail = async ({
  client,
  contentId,
  queries,
}: ClientWithContentId) => {
  return await client.getListDetail<Visit>({
    endpoint: "visits",
    contentId,
    queries,
  });
};