// microCMS Webhook 起因の Cloudflare エッジキャッシュパージ。
// Cache API（caches.default）で保存したエントリは、同一ゾーンのCDNキャッシュと
// 共有のため Zone Purge REST API で全エッジから一括無効化できる。
// （caches.default.delete() はリクエストを受けたコロにしか効かないため使わない）

/**
 * microCMS Webhook の署名（X-MICROCMS-Signature）を検証する。
 * 署名は「Webhookシークレットを鍵にした生リクエストボディの HMAC-SHA256（hex）」。
 */

export const verifyMicroCMSSignature = async (
  secret: string,
  rawBody: string,
  signature: string | null
): Promise<boolean> => {
  if (!signature) return false

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody))
  const expected = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, '0')).join('')

  return timingSafeEqual(expected, signature)
}

// タイミング攻撃を避けるための定数時間比較（hex文字列同士）
const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Cloudflare Zone Purge API でゾーン全体のキャッシュを消す。
 * Cache API で保存した公開ページもまとめて無効化される。
 */
export const purgeAllCache = async ({
  zoneId,
  token,
}: {
  zoneId: string
  token: string
}): Promise<{ ok: boolean; status: number; body: string }> => {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ purge_everything: true }),
  })
  const body = await res.text()
  return { ok: res.ok, status: res.status, body }
}
