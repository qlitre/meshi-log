import type {} from 'hono'
import type { OAuthHelpers } from '@cloudflare/workers-oauth-provider'
import type { Meta } from './types/meta'

interface Head {
  meta: Meta
}

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {
      SERVICE_DOMAIN: string
      API_KEY: string
      DB: D1Database
      TURNSTILE_SITE_KEY: string
      TURNSTILE_SECRET_KEY: string
      EMAIL: SendEmail
      NOTIFICATION_EMAIL: string
      CF_ACCESS_TEAM_DOMAIN: string
      CF_ACCESS_AUDIENCE: string
      OAUTH_KV: KVNamespace
      OAUTH_PROVIDER: OAuthHelpers
      MICROCMS_WEBHOOK_SECRET: string
      CF_ZONE_ID: string
      CF_PURGE_TOKEN: string
    }
  }
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head?: Head & { frontmatter?: Meta }
    ): Response | Promise<Response>
  }
}
