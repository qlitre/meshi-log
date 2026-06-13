import { createRoute } from 'honox/factory'
import { purgeAllCache, verifyMicroCMSSignature } from '../../../libs/cache-purge'

// microCMS の content 更新 Webhook を受けてエッジキャッシュをパージする。
// 通知先: https://meshi-log.info/api/webhook/cache-purge
export const POST = createRoute(async (c) => {
  const secret = c.env.MICROCMS_WEBHOOK_SECRET
  const zoneId = c.env.CF_ZONE_ID
  const token = c.env.CF_PURGE_TOKEN

  // 必須シークレット未設定（ローカル/プレビュー）では無効化
  if (!secret || !zoneId || !token) {
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

  const result = await purgeAllCache({ zoneId, token })
  if (!result.ok) {
    console.error(`cache purge failed (api=${api}): ${result.status} ${result.body}`)
    return c.json({ ok: false }, 502)
  }

  return c.json({ ok: true, api })
})
