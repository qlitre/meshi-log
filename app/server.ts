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
  // TODO: 7/23以降に accessTokenTTL: 3600, refreshTokenTTL: 30 * 24 * 3600 に戻す
  accessTokenTTL: 900,
  refreshTokenTTL: 0,
})

const PROTECTED_RESOURCE_PREFIX = '/.well-known/oauth-protected-resource'

export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    // OAuthProviderは任意のパスに対してprotected-resourceメタデータを200で返すため、
    // 認証不要の /mcp までOAuth保護されたリソースだとクライアントに誤認させてしまう。
    // OAuth必須なのは /mcp/admin だけなので、それ以外へのメタデータ要求は404にする
    const { pathname } = new URL(request.url)
    if (
      pathname.startsWith(PROTECTED_RESOURCE_PREFIX) &&
      pathname !== `${PROTECTED_RESOURCE_PREFIX}/mcp/admin`
    ) {
      return new Response(null, { status: 404 })
    }
    return oauthProvider.fetch(request, env, ctx)
  },
}
