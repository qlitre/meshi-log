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
import { StreamableHTTPTransport } from '@hono/mcp'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { Context } from 'hono'
import { config } from '../siteSettings'
import { HTTPException } from 'hono/http-exception'
import { Hono } from 'hono'
import type { Env } from 'hono'

const limit = 30

export const getMcpServer = async (c: Context<Env>) => {
  const serviceDomain = c.env.SERVICE_DOMAIN
  const apiKey = c.env.API_KEY
  const client = getMicroCMSClient({ serviceDomain: serviceDomain, apiKey: apiKey })
  const server = new McpServer({
    name: 'meshi-log MCP Server',
    version: '0.0.1',
  })

  server.tool('get_api_schema', 'Get microCMS API Schema', {}, async () => {
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
  })
  server.tool(
    'get_shops',
    'Get Shops with optional filters (area, genre, recommended status) and search query. Returns paginated results with 30 items per page.',
    {
      page: z.number().min(1).default(1),
      q: z.string().optional(),
      area_id: z.string().optional(),
      genre_id: z.string().optional(),
      is_recomended: z.boolean().optional(),
    },
    async ({ page, q, area_id, genre_id, is_recomended }) => {
      const offset = limit * (page - 1)
      const queries: MicroCMSQueries = {
        limit: limit,
        offset: offset,
      }
      if (q) queries.q = q

      let filterString = ''
      const filterCondition = []
      if (area_id) filterCondition.push(`area[equals]${area_id}`)
      if (genre_id) filterCondition.push(`genre[equals]${genre_id}`)
      if (is_recomended) filterCondition.push(`is_recommended[equals]true`)
      if (filterCondition.length > 0) {
        filterString = filterCondition.join('[and]')
      }
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

  server.tool(
    'get_visits',
    'Get Visits with optional search',
    {
      page: z.number().min(1).default(1),
      q: z.string().optional(),
    },
    async ({ page, q }) => {
      const offset = limit * (page - 1)
      const queries: MicroCMSQueries = {
        limit: limit,
        offset: offset,
        fields: config.visitListFields,
        ...(q && { q: q }),
      }
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
  server.tool(
    'get_visit_detail',
    'Get Visit Detail',
    {
      id: z.string().min(1),
    },
    async ({ id }) => {
      const result = await getVisitDetail({ client, contentId: id })
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
  server.tool(
    'get_areas',
    'Get shop areas',
    {
      q: z.string().optional(),
    },
    async ({ q }) => {
      const queries: MicroCMSQueries = {
        limit: 100,
        ...(q && { q: q }),
      }
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
  server.tool(
    'get_genres',
    'Get shop genres',
    {
      q: z.string().optional(),
    },
    async ({ q }) => {
      const queries: MicroCMSQueries = {
        limit: 100,
        ...(q && { q: q }),
      }
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
