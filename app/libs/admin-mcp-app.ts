import { Hono } from 'hono'
import type { Env } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { StreamableHTTPTransport } from '@hono/mcp'
import { getMcpServer } from '../routes/mcp'

const adminApp = new Hono<Env>()

adminApp.all('/mcp/admin', async (c) => {
  const mcpServer = await getMcpServer(c, { includeWriteTools: true })
  const transport = new StreamableHTTPTransport()
  await mcpServer.connect(transport)
  return transport.handleRequest(c)
})

adminApp.onError((err, c) => {
  console.log(err.message)
  if (err instanceof HTTPException && err.res) return err.res
  return c.json(
    {
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal server error' },
      id: null,
    },
    500
  )
})

export default adminApp
