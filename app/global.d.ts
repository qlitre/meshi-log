import type {} from 'hono'
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
    }
  }
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head?: Head & { frontmatter?: Meta }
    ): Response | Promise<Response>
  }
}
