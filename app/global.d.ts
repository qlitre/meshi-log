import type {} from 'hono'

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {
      SERVICE_DOMAIN: string
      API_KEY: string
    }
  }
}
