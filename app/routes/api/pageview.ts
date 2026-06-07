import { createRoute } from 'honox/factory'
import { incrementPageView } from '../../libs/pageview'

const ID_PATTERN = /^[A-Za-z0-9_-]+$/

// PVビーコン受信。クライアントからは visit の id のみ受け取り、
// seed済みページに限りカウントを加算する（経路・メタは信用しない）。
export const POST = createRoute(async (c) => {
  let id = ''
  try {
    const body = (await c.req.json()) as { id?: unknown }
    id = typeof body.id === 'string' ? body.id : ''
  } catch {
    return c.body(null, 400)
  }

  if (!ID_PATTERN.test(id)) {
    return c.body(null, 400)
  }

  await incrementPageView({ db: c.env.DB, contentId: id })
  return c.body(null, 204)
})
