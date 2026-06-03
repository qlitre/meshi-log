import type { MicroCMSQueries } from 'microcms-js-sdk'
import {
  getMicroCMSClient,
  getMicroCMSSchema,
  getVisits,
  getVisitDetail,
  getAllAreas,
  getAllGenres,
  getShops,
  getShopDetail,
  createArea,
  createGenre,
  createShop,
  updateShop,
} from '../libs/microcms'
import { getPopularPages } from '../libs/pageview'
import { StreamableHTTPTransport } from '@hono/mcp'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { Context } from 'hono'
import { config } from '../siteSettings'
import { HTTPException } from 'hono/http-exception'
import { Hono } from 'hono'
import type { Env } from 'hono'
import { buildShopFilterCondition } from '../utils/buildShopFilterCondition'

const limit = config.serachPerPage

type McpServerOptions = {
  includeWriteTools?: boolean
}

export const getMcpServer = async (c: Context<Env>, options: McpServerOptions = {}) => {
  const serviceDomain = c.env.SERVICE_DOMAIN
  const apiKey = c.env.API_KEY
  const client = getMicroCMSClient(c)
  const server = new McpServer({
    name: 'meshi-log MCP Server',
    version: '0.0.1',
  })

  server.registerTool(
    'get_api_schema',
    { title: 'Get Api Schema', description: 'get microcms api schema', inputSchema: {} },
    async () => {
      const result = await getMicroCMSSchema({
        serviceDomain: serviceDomain,
        apiKey: apiKey,
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
  server.registerTool(
    'get_shops',
    {
      title: 'Get Shops',
      description:
        'Get Shops with optional filters (area, genre, recommended status) and search query. Returns paginated results with 30 items per page.',
      inputSchema: {
        page: z.number().min(1).default(1),
        q: z.string().optional(),
        area_id: z.string().optional(),
        genre_id: z.string().optional(),
        is_recommended: z.boolean().optional(),
      },
    },
    async (
      params:
        | {
            page?: number
            q?: string
            area_id?: string
            genre_ids?: string[]
            is_recommended?: boolean
          }
        | undefined
    ) => {
      const page = params?.page ?? 1
      const offset = limit * (page - 1)
      const queries: MicroCMSQueries = {
        limit: limit,
        offset: offset,
      }
      if (params?.q) queries.q = params.q

      const filterString = buildShopFilterCondition({
        area_id: params?.area_id,
        genre_ids: params?.genre_ids,
        is_recommended: params?.is_recommended,
      })
      if (filterString) queries.filters = filterString

      const result = await getShops({ client, queries })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
  server.registerTool(
    'get_shop_detail',
    {
      title: 'Get Shop Detail',
      description: 'Get Shop Detail',
      inputSchema: {
        id: z.string().min(1),
      },
    },
    async (params: { id: string } | undefined) => {
      if (!params?.id) {
        throw new Error('id is required')
      }
      const result = await getShopDetail({ client, contentId: params.id })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  server.registerTool(
    'get_visits',
    {
      title: 'Get Visits',
      description: 'Get Visits with optional search',
      inputSchema: {
        page: z.number().min(1).default(1),
        q: z.string().optional(),
      },
    },
    async (params: { page?: number; q?: string } | undefined) => {
      const page = params?.page ?? 1
      const offset = limit * (page - 1)
      const queries: MicroCMSQueries = {
        limit: limit,
        offset: offset,
        fields: config.visitListFields,
      }
      if (params?.q) queries.q = params.q
      const result = await getVisits({ client, queries })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
  server.registerTool(
    'get_recent_visit_detail_by_shop',
    {
      title: 'Get Visits By Shop',
      description: 'Get the latest visit for a specific shop',
      inputSchema: {
        shop_id: z.string().min(1),
      },
    },
    async (params: { shop_id: string }) => {
      const queries: MicroCMSQueries = {
        limit: 1,
        fields: 'id,title,thumbnail,memo,visit_date,publishedAt',
        filters: `shop[equals]${params.shop_id}`,
        orders: '-visit_date',
      }
      const visits = await getVisits({ client, queries })
      if (visits.contents.length === 0) {
        return { content: [{ type: 'text', text: JSON.stringify({ contents: [] }, null, 2) }] }
      }
      const result = await getVisitDetail({ client, contentId: visits.contents[0].id })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
  server.registerTool(
    'get_visit_detail',
    {
      title: 'Get Visit Detail',
      description: 'Get Visit Detail',
      inputSchema: {
        id: z.string().min(1),
      },
    },
    async (params: { id: string } | undefined) => {
      if (!params?.id) {
        throw new Error('id is required')
      }
      const result = await getVisitDetail({ client, contentId: params.id })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
  server.registerTool(
    'get_areas',
    {
      title: 'Get Areas',
      description: 'Get shop areas',
      inputSchema: {
        q: z.string().optional(),
      },
    },
    async (params: { q?: string } | undefined) => {
      const queries: MicroCMSQueries = {
        orders: 'code',
      }
      if (params?.q) queries.q = params.q
      const result = await getAllAreas({ client, queries })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
  server.registerTool(
    'get_genres',
    {
      title: 'Get Genres',
      description: 'Get shop genres',
      inputSchema: {
        q: z.string().optional(),
      },
    },
    async (params: { q?: string } | undefined) => {
      const queries: MicroCMSQueries = {
        orders: 'name',
      }
      if (params?.q) queries.q = params.q
      const result = await getAllGenres({ client, queries })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
  server.registerTool(
    'get_popular_visits',
    {
      title: 'Get Popular Visits',
      description: 'Get Popular Visits',
      inputSchema: {},
    },
    async () => {
      const result = await getPopularPages(c.env.DB)
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  if (options.includeWriteTools) {
    server.registerTool(
      'create_area',
      {
        title: 'Create Area',
        description:
          'Create a new area in microCMS. `code` is the JIS municipality code (e.g. "13101" for Chiyoda-ku). `id` is the contentId, conventionally a romaji slug derived from the area name (e.g. "tokyo-to-machida-shi" for 東京都町田市, "tokyo-to-chiyoda-ku" for 東京都千代田区). Always specify `id` following this convention. IMPORTANT: Before calling this tool, you MUST look up the precise JIS municipality code via web search (search e.g. "東京都町田市 JIS 市区町村コード") — do NOT guess or infer the code from memory.',
        inputSchema: {
          id: z.string().min(1),
          code: z.string().min(1),
          name: z.string().min(1),
        },
      },
      async (params: { id: string; code: string; name: string }) => {
        const { id, ...body } = params
        const result = await createArea({ client, contentId: id, body })
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      }
    )

    server.registerTool(
      'create_genre',
      {
        title: 'Create Genre',
        description:
          'Create a new genre in microCMS. Optionally specify `id` for a custom contentId; if omitted, microCMS auto-generates one.',
        inputSchema: {
          id: z.string().optional(),
          name: z.string().min(1),
        },
      },
      async (params: { id?: string; name: string }) => {
        const { id, ...body } = params
        const result = await createGenre({ client, contentId: id, body })
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      }
    )

    server.registerTool(
      'create_shop',
      {
        title: 'Create Shop',
        description:
          'Create a new shop in microCMS. `area` is the area content ID, `genre` is an array of genre content IDs. `area_code` is the JIS municipality code. IMPORTANT: Before calling this tool, you MUST look up both the precise `address` and `latitude`/`longitude` via web search or the "Searching for place" tool — search for the actual shop name and verify the address and coordinates from the results. Do NOT guess, infer, or use approximate values. `id` rule: derive a URL-friendly romaji slug from the official shop name found via web search (NOT a transliteration of whatever the user typed — verify the official name and its standard romanization through search results). By default use `{shop_name_slug}` only. Append the area name ONLY when the same shop name has multiple branches across different locations (chain stores, etc.) and disambiguation is required; in that case use the format `{shop_name_slug}-{area_name_slug}` (e.g. `ichiran-shibuya`, `ichiran-shinjuku`). For a single-location shop, do NOT append the area name. If `id` is omitted, microCMS auto-generates one.',
        inputSchema: {
          id: z.string().optional(),
          name: z.string().min(1),
          address: z.string().min(1),
          latitude: z.number(),
          longitude: z.number(),
          area: z.string().min(1),
          area_code: z.string().min(1),
          genre: z.array(z.string().min(1)).min(1),
          memo: z.string(),
          is_recommended: z.boolean().default(false),
          rating: z.number().min(0).max(5).optional().default(4),
          nearest_station: z.string().optional(),
        },
      },
      async (params: {
        id?: string
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
      }) => {
        const { id, ...body } = params
        const result = await createShop({ client, contentId: id, body })
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      }
    )
    server.registerTool(
      'update_shop',
      {
        title: 'Update Shop',
        description:
          'Partially update an existing shop in microCMS. `id` is the contentId of the shop to update. Only provide the fields you want to change — omitted fields are left as-is. `area` is the area content ID, `genre` is an array of genre content IDs. If updating `address` or coordinates, you MUST look up the precise `address` and `latitude`/`longitude` via web search — do NOT guess or use approximate values.',
        inputSchema: {
          id: z.string(),
          name: z.string().min(1).optional(),
          address: z.string().min(1).optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          area: z.string().min(1).optional(),
          area_code: z.string().min(1).optional(),
          genre: z.array(z.string().min(1)).min(1).optional(),
          memo: z.string().optional(),
          is_recommended: z.boolean().optional(),
          rating: z.number().min(0).max(5).optional(),
          nearest_station: z.string().optional(),
        },
      },
      async (params: {
        id: string
        name?: string
        address?: string
        latitude?: number
        longitude?: number
        area?: string
        area_code?: string
        genre?: string[]
        memo?: string
        is_recommended?: boolean
        rating?: number
        nearest_station?: string
      }) => {
        const { id, ...body } = params
        if (Object.values(body).every((v) => v === undefined)) {
          return {
            content: [{ type: 'text', text: 'No fields to update were specified.' }],
          }
        }
        const result = await updateShop({ client, contentId: id, body })
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      }
    )
  }

  return server
}

const app = new Hono<Env>()

app.all('/', async (c) => {
  const mcpServer = await getMcpServer(c)
  const transport = new StreamableHTTPTransport()
  await mcpServer.connect(transport)
  return transport.handleRequest(c)
})

app.onError((err, c) => {
  console.log(err.message)

  if (err instanceof HTTPException && err.res) {
    return err.res
  }

  return c.json(
    {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error',
      },
      id: null,
    },
    500
  )
})

export default app
