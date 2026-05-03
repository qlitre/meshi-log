import { createRoute } from 'honox/factory'

const Page = ({
  clientName,
  scope,
  error,
}: {
  clientName: string
  scope: string
  error?: string
}) => (
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="noindex,nofollow" />
      <title>meshi-log MCP Authorize</title>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 420px; margin: 64px auto; padding: 24px; color: #222; }
            h1 { font-size: 1.25rem; margin-bottom: 1rem; }
            .info { background: #f5f5f5; padding: 12px 16px; border-radius: 6px; font-size: 0.9rem; margin-bottom: 16px; }
            .info dt { font-weight: 600; color: #555; }
            .info dd { margin: 0 0 8px 0; word-break: break-all; }
            input[type=password] { width: 100%; padding: 10px; font-size: 1rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
            button { width: 100%; padding: 12px; margin-top: 12px; font-size: 1rem; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
            button:hover { background: #333; }
            .error { color: #c33; margin-bottom: 12px; font-size: 0.9rem; }
          `,
        }}
      />
    </head>
    <body>
      <h1>MCP Authorization</h1>
      <dl class="info">
        <dt>Client</dt>
        <dd>{clientName}</dd>
        <dt>Scope</dt>
        <dd>{scope || '(none)'}</dd>
      </dl>
      {error && <p class="error">{error}</p>}
      <form method="post">
        <input type="password" name="password" placeholder="Admin password" autofocus required />
        <button type="submit">Authorize</button>
      </form>
    </body>
  </html>
)

export const GET = createRoute(async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw)
  const client = await c.env.OAUTH_PROVIDER.lookupClient(oauthReqInfo.clientId)
  const clientName = client?.clientName ?? oauthReqInfo.clientId
  const scope = oauthReqInfo.scope.join(' ')
  return c.html(<Page clientName={clientName} scope={scope} />)
})

export const POST = createRoute(async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw)
  const formData = await c.req.formData()
  const password = formData.get('password')

  if (typeof password !== 'string' || password !== c.env.ADMIN_PASSWORD) {
    const client = await c.env.OAUTH_PROVIDER.lookupClient(oauthReqInfo.clientId)
    const clientName = client?.clientName ?? oauthReqInfo.clientId
    return c.html(
      <Page
        clientName={clientName}
        scope={oauthReqInfo.scope.join(' ')}
        error="パスワードが正しくありません"
      />,
      401
    )
  }

  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    request: oauthReqInfo,
    userId: 'admin',
    scope: oauthReqInfo.scope,
    metadata: {},
    props: {},
  })
  return c.redirect(redirectTo)
})
