import type { MicroCMSQueries } from 'microcms-js-sdk'
import {
  getMicroCMSClient,
  getMicroCMSSchema,
  getVisits,
  getVisitDetail,
  getAreas,
  getGenres,
  getShops,
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

export const getMcpServer = async (c: Context<Env>) => {
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
            genre_id?: string
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
        genre_id: params?.genre_id,
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
        limit: 100,
      }
      if (params?.q) queries.q = params.q
      const result = await getAreas({ client, queries })
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
        limit: 100,
      }
      if (params?.q) queries.q = params.q
      const result = await getGenres({ client, queries })
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
