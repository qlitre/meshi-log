import { Hono } from 'hono'
import type { Env } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/server'
import { getMcpServer } from '../routes/mcp'

// このファイルは app/routes/ に置いてはならない。
// HonoX のファイルベースルーティングが拾ってしまい、書き込みツールが
// OAuth を経由せず公開ホストから叩けるようになるため。
const adminApp = new Hono<Env>()

// OAuthProvider は元のURLのまま handler に渡すため、絶対パスで受ける
adminApp.all('/mcp/admin', async (c) => {
  const mcpServer = await getMcpServer(c, { includeWriteTools: true })
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })
  await mcpServer.connect(transport)
  return transport.handleRequest(c.req.raw)
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
