import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { OAuthProvider } from '@cloudflare/workers-oauth-provider'
import mcpApp from './routes/mcp'
import adminMcpApp from './routes/mcp-admin'

const honoxApp = createApp()

honoxApp.route('/mcp', mcpApp)

showRoutes(honoxApp)

const oauthProvider = new OAuthProvider({
  apiRoute: '/mcp/admin',
  apiHandler: adminMcpApp,
  defaultHandler: honoxApp,
  authorizeEndpoint: '/oauth/authorize',
  tokenEndpoint: '/oauth/token',
  clientRegistrationEndpoint: '/oauth/register',
  scopesSupported: ['mcp:write'],
  accessTokenTTL: 3600,
  refreshTokenTTL: 30 * 24 * 3600,
})

// OAuth(admin MCP)はこのホストだけで提供する。localhostは開発時に全機能を使うため含める
const OAUTH_HOSTS = ['admin.meshi-log.info', 'localhost', '127.0.0.1']

export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const { hostname, pathname } = new URL(request.url)
    if (OAUTH_HOSTS.includes(hostname)) {
      return oauthProvider.fetch(request, env, ctx)
    }
    // 公開ホストにはOAuthの痕跡を一切出さない。
    // ディスカバリ優先のMCPクライアント(Claudeコネクタ等)はメタデータを見つけると
    // 認証必須と誤認し、認証なしの /mcp に接続できなくなるため
    if (
      pathname.startsWith('/.well-known/oauth-') ||
      pathname.startsWith('/oauth/') ||
      pathname.startsWith('/mcp/admin')
    ) {
      return new Response(null, { status: 404 })
    }
    return honoxApp.fetch(request, env, ctx)
  },
}
