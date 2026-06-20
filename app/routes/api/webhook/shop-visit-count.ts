import { createRoute } from 'honox/factory'
import { verifyMicroCMSSignature } from '../../../libs/microcms-webhook'
import { rebuildShopVisitCounts } from '../../../libs/shop-visit-counts'

export const POST = createRoute(async (c) => {
  const secret = c.env.MICROCMS_WEBHOOK_SECRET

  // 必須シークレット未設定（ローカル/プレビュー）では無効化
  if (!secret) {
    return c.body(null, 503)
  }

  // 署名検証は生ボディに対して行う必要があるため text() で受ける
  const rawBody = await c.req.text()
  const signature = c.req.header('X-MICROCMS-Signature') ?? null

  if (!(await verifyMicroCMSSignature(secret, rawBody, signature))) {
    return c.body(null, 401)
  }

  // 署名済みなので payload は信頼できる。種別はログ用途のみ
  let api = 'unknown'
  try {
    api = (JSON.parse(rawBody) as { api?: string }).api ?? 'unknown'
  } catch {
    // ignore
  }

  c.executionCtx.waitUntil(rebuildShopVisitCounts(c))

  return c.json({ ok: true, api })
})
