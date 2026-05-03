import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { OAuthProvider } from '@cloudflare/workers-oauth-provider'
import mcpApp from './routes/mcp'
import adminMcpApp from './libs/admin-mcp-app'

const honoxApp = createApp()

honoxApp.route('/mcp', mcpApp)

showRoutes(honoxApp)

export default new OAuthProvider({
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
